import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: "./server/.env" });

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.warn("⚠️ Warning: Supabase URL is not set in server/.env");
}

// Client for validating user JWT access tokens
const authClient = createClient(supabaseUrl, supabaseServiceKey || supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/**
 * Validates a Supabase JWT access token and returns the authenticated user.
 * @param {string} token - The Bearer access token from request Authorization header
 * @returns {Promise<{ user: object|null, error: object|null }>}
 */
export async function getUserFromToken(token) {
  if (!token) {
    return { user: null, error: new Error("No token provided") };
  }

  try {
    const { data, error } = await authClient.auth.getUser(token);
    if (error || !data?.user) {
      return { user: null, error: error || new Error("User not found") };
    }
    return { user: data.user, error: null };
  } catch (err) {
    return { user: null, error: err };
  }
}

/**
 * Returns a Supabase client suitable for database operations.
 * Uses service role client if configured, otherwise falls back to a user-scoped client.
 * @param {string} [accessToken] - The user's access token
 */
export function getDbClient(accessToken) {
  if (supabaseServiceKey) {
    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}
