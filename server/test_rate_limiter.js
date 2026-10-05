import dotenv from "dotenv";
import { checkAndRecordUsage, getRateLimitConfig, rollbackUsage } from "./rateLimiter.js";

dotenv.config({ path: "./server/.env" });

// Mock DB client for unit & concurrency testing
class MockDbClient {
  constructor() {
    this.records = [];
  }

  from(table) {
    if (table !== "ai_chat_usage") throw new Error("Unknown table " + table);
    const self = this;

    return {
      select(_fields) {
        return {
          eq(field, value) {
            return {
              gte(dateField, dateValue) {
                return {
                  order(orderField, { ascending } = {}) {
                    const filtered = self.records.filter(
                      (r) => r.user_id === value && new Date(r.created_at) >= new Date(dateValue)
                    );
                    filtered.sort((a, b) =>
                      ascending
                        ? new Date(a.created_at) - new Date(b.created_at)
                        : new Date(b.created_at) - new Date(a.created_at)
                    );
                    return Promise.resolve({ data: filtered, error: null });
                  },
                };
              },
            };
          },
        };
      },
      insert(row) {
        return {
          select() {
            return {
              single() {
                const inserted = {
                  id: "mock-" + Math.random().toString(36).substring(2),
                  ...row,
                };
                self.records.push(inserted);
                return Promise.resolve({ data: inserted, error: null });
              },
            };
          },
        };
      },
      delete() {
        return {
          eq(field, value) {
            self.records = self.records.filter((r) => r[field] !== value);
            return Promise.resolve({ error: null });
          },
        };
      },
    };
  }
}

async function runTests() {
  console.log("=== RUNNING RATE LIMITER VERIFICATION SUITE ===\n");
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (!condition) {
      console.error(`❌ FAIL: ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    } else {
      console.log(`✅ PASS: ${message}`);
      passed++;
    }
  }

  const mockDb = new MockDbClient();
  const testUser1 = { id: "user-uuid-1" };
  const testUser2 = { id: "user-uuid-2" };

  // Test 1: Config loading
  const config = getRateLimitConfig();
  assert(config.limit === 10, "Config limit defaults to 10 (or configured)");
  assert(config.windowHours === 6, "Config window hours defaults to 6");

  // Test 2: Sequential requests up to limit
  console.log("\nTesting sequential requests 1 to 10 for User 1...");
  for (let i = 1; i <= 10; i++) {
    const res = await checkAndRecordUsage(testUser1, mockDb);
    assert(res.allowed === true, `Request ${i} is allowed`);
    assert(res.rateLimit.used === i, `Used count is ${i}`);
    assert(res.rateLimit.remaining === 10 - i, `Remaining count is ${10 - i}`);
  }

  // Test 3: Request 11 should be rejected with 429
  console.log("\nTesting request 11 for User 1 (should be blocked)...");
  const blockedRes = await checkAndRecordUsage(testUser1, mockDb);
  assert(blockedRes.allowed === false, "Request 11 is blocked");
  assert(blockedRes.rateLimit.used === 10, "Used count is capped at 10");
  assert(blockedRes.rateLimit.remaining === 0, "Remaining count is 0");
  assert(typeof blockedRes.retryAfter === "number" && blockedRes.retryAfter > 0, "retryAfter is positive seconds");
  assert(blockedRes.retryAfter <= 6 * 3600, "retryAfter is <= 6 hours in seconds");
  assert(Boolean(blockedRes.retryAt), "retryAt is valid timestamp");

  // Test 4: Independent limits for another user
  console.log("\nTesting independent limit for User 2...");
  const user2Res = await checkAndRecordUsage(testUser2, mockDb);
  assert(user2Res.allowed === true, "User 2 request 1 is allowed independently");
  assert(user2Res.rateLimit.used === 1, "User 2 used count is 1");
  assert(user2Res.rateLimit.remaining === 9, "User 2 remaining count is 9");

  // User 1 should still be blocked
  const user1Check = await checkAndRecordUsage(testUser1, mockDb);
  assert(user1Check.allowed === false, "User 1 remains blocked");

  // Test 5: Rolling window expiry
  console.log("\nTesting rolling window expiry calculation...");
  const sixHoursAndOneMinuteAgo = new Date(Date.now() - (6 * 3600 + 60) * 1000).toISOString();
  mockDb.records[0].created_at = sixHoursAndOneMinuteAgo;

  const expiredCheck = await checkAndRecordUsage(testUser1, mockDb);
  assert(expiredCheck.allowed === true, "After oldest request expires, next request is allowed");
  assert(expiredCheck.rateLimit.used === 10, "Usage is back at 10");

  // Test 6: Simultaneous requests concurrency protection
  console.log("\nTesting race condition protection with 15 concurrent requests...");
  const concurrentUser = { id: "concurrent-user" };
  const promises = [];
  for (let i = 0; i < 15; i++) {
    promises.push(checkAndRecordUsage(concurrentUser, mockDb));
  }
  const results = await Promise.all(promises);
  const allowedCount = results.filter((r) => r.allowed).length;
  const blockedCount = results.filter((r) => !r.allowed).length;

  assert(allowedCount === 10, `Exactly 10 concurrent requests allowed (got ${allowedCount})`);
  assert(blockedCount === 5, `Exactly 5 concurrent requests blocked (got ${blockedCount})`);

  // Test 7: Rollback / refund when Gemini fails
  console.log("\nTesting quota refund / rollback on server failure...");
  const refundUser = { id: "refund-user" };
  const beforeRefund = await checkAndRecordUsage(refundUser, mockDb);
  assert(beforeRefund.allowed === true, "Initial request allowed");
  assert(mockDb.records.filter((r) => r.user_id === refundUser.id).length === 1, "1 record in DB");

  // Simulate rollback
  await rollbackUsage(beforeRefund.usageRecord.id, mockDb);
  assert(
    mockDb.records.filter((r) => r.user_id === refundUser.id).length === 0,
    "Record deleted from DB after rollback"
  );

  console.log(`\n🎉 ALL ${passed}/${total} TESTS PASSED SUCCESSFULLY!`);
}

runTests().catch((err) => {
  console.error("Test suite failed:", err);
  process.exit(1);
});
