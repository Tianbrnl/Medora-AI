import dotenv from "dotenv";

dotenv.config({ path: "./server/.env" });

// Per-user async mutex to prevent concurrent request race conditions
const userLocks = new Map();

/**
 * Executes an async task while holding an exclusive lock for the given userId.
 * Ensures that simultaneous requests for the same user are processed sequentially.
 */
export async function withUserLock(userId, fn) {
  const currentLock = userLocks.get(userId) || Promise.resolve();
  let release;
  const nextLock = new Promise((resolve) => {
    release = resolve;
  });
  userLocks.set(userId, nextLock);

  try {
    await currentLock;
    return await fn();
  } finally {
    release();
    if (userLocks.get(userId) === nextLock) {
      userLocks.delete(userId);
    }
  }
}

/**
 * Returns the current configuration values.
 */
export function getRateLimitConfig() {
  const limit = parseInt(process.env.AI_CHAT_LIMIT, 10) || 10;
  const windowHours = parseFloat(process.env.AI_CHAT_WINDOW_HOURS) || 6;
  return { limit, windowHours };
}

/**
 * Checks if the user is within their rate limit in the rolling window.
 * If under limit, atomically records the usage and returns allowed = true.
 * If at or over limit, returns allowed = false with retryAfter and retryAt.
 *
 * @param {object} user - The authenticated user object
 * @param {object} dbClient - Supabase client (service role or token-scoped)
 */
export async function checkAndRecordUsage(user, dbClient) {
  return await withUserLock(user.id, async () => {
    const { limit, windowHours } = getRateLimitConfig();
    const now = Date.now();
    const windowStart = new Date(now - windowHours * 60 * 60 * 1000).toISOString();

    // Query all usage records for this user in the rolling window
    const { data: records, error } = await dbClient
      .from("ai_chat_usage")
      .select("id, created_at")
      .eq("user_id", user.id)
      .gte("created_at", windowStart)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error checking rate limit from database:", error);
      // If RLS policy is not configured in Supabase, warn and allow request
      if (error.code === "42501" || error.code === "42P01") {
        console.warn(
          "⚠️ Notice: 'ai_chat_usage' RLS policy or table is missing. Run server/ai_chat_usage.sql in Supabase SQL editor or add SUPABASE_SERVICE_ROLE_KEY to server/.env."
        );
        return {
          allowed: true,
          usageRecord: null,
          rateLimit: {
            used: 0,
            limit,
            remaining: limit,
          },
        };
      }
      throw new Error(`Failed to verify AI usage limit: ${error.message}`);
    }

    const currentRecords = records || [];

    if (currentRecords.length >= limit) {
      // User is at or above the limit
      // The oldest request in the current window determines when the next slot opens
      const oldestRecord = currentRecords[0];
      const oldestTime = new Date(oldestRecord.created_at).getTime();
      const nextAvailableTime = oldestTime + windowHours * 60 * 60 * 1000;
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((nextAvailableTime - now) / 1000)
      );
      const retryAtIso = new Date(nextAvailableTime).toISOString();

      return {
        allowed: false,
        retryAfter: retryAfterSeconds,
        retryAt: retryAtIso,
        rateLimit: {
          used: currentRecords.length,
          limit,
          remaining: 0,
        },
      };
    }

    // Under limit: record request before calling Gemini
    const { data: newRecord, error: insertError } = await dbClient
      .from("ai_chat_usage")
      .insert({
        user_id: user.id,
        created_at: new Date(now).toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error recording AI usage in database:", insertError);
      // If RLS policy is not configured in Supabase, warn and allow request
      if (insertError.code === "42501" || insertError.code === "42P01") {
        console.warn(
          "⚠️ Notice: 'ai_chat_usage' RLS policy is missing for INSERT. Run server/ai_chat_usage.sql in Supabase SQL editor or add SUPABASE_SERVICE_ROLE_KEY to server/.env."
        );
        return {
          allowed: true,
          usageRecord: null,
          rateLimit: {
            used: currentRecords.length,
            limit,
            remaining: Math.max(0, limit - currentRecords.length),
          },
        };
      }
      throw new Error(`Failed to record AI usage: ${insertError.message}`);
    }

    const used = currentRecords.length + 1;
    const remaining = Math.max(0, limit - used);

    return {
      allowed: true,
      usageRecord: newRecord,
      rateLimit: {
        used,
        limit,
        remaining,
      },
    };
  });
}

/**
 * Rolls back an already-recorded usage row in case Gemini or the server encounters an internal error.
 * Ensures internal errors do NOT consume the user's quota.
 *
 * @param {string} recordId - ID of the ai_chat_usage row to delete
 * @param {object} dbClient - Supabase client
 */
export async function rollbackUsage(recordId, dbClient) {
  if (!recordId) return;

  try {
    const { error } = await dbClient
      .from("ai_chat_usage")
      .delete()
      .eq("id", recordId);

    if (error) {
      console.error(`Failed to rollback usage record ${recordId}:`, error);
    } else {
      console.log(`Successfully rolled back usage record ${recordId} after error.`);
    }
  } catch (err) {
    console.error(`Exception during rollback of usage record ${recordId}:`, err);
  }
}
