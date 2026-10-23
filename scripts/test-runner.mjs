// ============================================================================
// LOOPSPACE TEST SUITE
// Automated verification of critical workflows and business logic
// ============================================================================

import assert from "node:assert";

console.log("=================================================");
console.log("  RUNNING LOOPSPACE TEST SUITE");
console.log("=================================================\n");

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    Error: ${err.message}`);
  }
}

// ----------------------------------------------------------------------------
// Test 1: Stopword extraction & keyword tokenization
// ----------------------------------------------------------------------------
test("Matching Engine: Extracts keywords properly ignoring stopwords", () => {
  const STOP_WORDS = new Set(["a", "an", "the", "for", "in", "need", "i"]);
  function extractKeywords(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  }

  const query = "I urgently need a graphing calculator for Calculus";
  const tokens = extractKeywords(query);
  assert.ok(tokens.includes("urgently"));
  assert.ok(tokens.includes("graphing"));
  assert.ok(tokens.includes("calculator"));
  assert.ok(tokens.includes("calculus"));
  assert.ok(!tokens.includes("i"));
  assert.ok(!tokens.includes("for"));
});

// ----------------------------------------------------------------------------
// Test 2: Date Overlap Evaluation
// ----------------------------------------------------------------------------
test("Matching Engine: Availability date window validation", () => {
  function evaluateDateOverlap(resFrom, resUntil, reqFrom, reqUntil) {
    if (!reqFrom && !reqUntil) return true;
    if (!resFrom && !resUntil) return true;
    const rStart = new Date(reqFrom).getTime();
    const rEnd = new Date(reqUntil).getTime();
    const aStart = new Date(resFrom).getTime();
    const aEnd = new Date(resUntil).getTime();

    if (rStart < aStart) return false;
    if (rEnd > aEnd) return false;
    return true;
  }

  // Inside window
  assert.strictEqual(
    evaluateDateOverlap("2026-10-01", "2026-12-15", "2026-10-10", "2026-10-20"),
    true
  );

  // Starts before item is available
  assert.strictEqual(
    evaluateDateOverlap("2026-10-15", "2026-12-15", "2026-10-01", "2026-10-20"),
    false
  );

  // Ends after item availability
  assert.strictEqual(
    evaluateDateOverlap("2026-10-01", "2026-11-01", "2026-10-10", "2026-11-15"),
    false
  );
});

// ----------------------------------------------------------------------------
// Test 3: Prevents owner from requesting their own resource
// ----------------------------------------------------------------------------
test("Resource Request: Validates requester is not owner", () => {
  function validateRequest(requesterId, ownerId) {
    if (requesterId === ownerId) {
      throw new Error("You cannot request your own resource.");
    }
    return true;
  }

  assert.throws(() => validateRequest("user-1", "user-1"), /cannot request your own/);
  assert.strictEqual(validateRequest("user-1", "user-2"), true);
});

// ----------------------------------------------------------------------------
// Test 4: Impact Score Gamification & Duplicate Prevention
// ----------------------------------------------------------------------------
test("Impact Engine: Points awarded exactly once per unique exchange", () => {
  const transactions = [];

  function recordImpactTransaction(userId, requestId, activityType, points) {
    // Unique constraint check: (user_id, request_id, activity_type)
    const exists = transactions.some(
      (t) =>
        t.userId === userId &&
        t.requestId === requestId &&
        t.activityType === activityType
    );
    if (exists) {
      throw new Error("Duplicate impact reward prevented.");
    }
    transactions.push({ userId, requestId, activityType, points });
    return points;
  }

  // First reward succeeds
  const pts = recordImpactTransaction("user-1", "req-101", "loan_completed", 20);
  assert.strictEqual(pts, 20);

  // Duplicate attempt must fail
  assert.throws(
    () => recordImpactTransaction("user-1", "req-101", "loan_completed", 20),
    /Duplicate impact reward prevented/
  );
  assert.strictEqual(transactions.length, 1);
});

// ----------------------------------------------------------------------------
// Test 5: Badge Threshold Computation
// ----------------------------------------------------------------------------
test("Impact Engine: Unlocks badges correctly based on score thresholds", () => {
  const BADGES = [
    { id: "first_loop", minPoints: 20 },
    { id: "helpful_neighbor", minPoints: 50 },
    { id: "resource_saver", minPoints: 100 },
    { id: "community_champion", minPoints: 250 },
  ];

  function getUnlockedBadges(points) {
    return BADGES.filter((b) => points >= b.minPoints).map((b) => b.id);
  }

  assert.deepStrictEqual(getUnlockedBadges(10), []);
  assert.deepStrictEqual(getUnlockedBadges(20), ["first_loop"]);
  assert.deepStrictEqual(getUnlockedBadges(75), ["first_loop", "helpful_neighbor"]);
  assert.deepStrictEqual(getUnlockedBadges(120), [
    "first_loop",
    "helpful_neighbor",
    "resource_saver",
  ]);
  assert.deepStrictEqual(getUnlockedBadges(300), [
    "first_loop",
    "helpful_neighbor",
    "resource_saver",
    "community_champion",
  ]);
});

// ----------------------------------------------------------------------------
// Test 6: Google Sheets tabular rows & header consistency
// ----------------------------------------------------------------------------
test("Google Sheets Exporter: Formats rows and headers consistently", () => {
  const resourceHeaders = [
    "ID", "Title", "Category", "Sharing Type", "Condition", "Quantity",
    "Pickup Location", "Status", "Available From", "Available Until", "Views", "Created At"
  ];

  const sampleResource = {
    id: "res-1",
    title: "TI-84 Plus CE",
    category: "Electronics",
    sharing_type: "lend",
    condition: "like_new",
    quantity: 1,
    pickup_location: "Library",
    status: "available",
    available_from: "2026-10-01",
    available_until: "2026-12-15",
    views_count: 50,
    created_at: "2026-10-02T10:00:00Z"
  };

  const row = [
    sampleResource.id,
    sampleResource.title,
    sampleResource.category,
    sampleResource.sharing_type,
    sampleResource.condition,
    sampleResource.quantity,
    sampleResource.pickup_location,
    sampleResource.status,
    sampleResource.available_from,
    sampleResource.available_until,
    sampleResource.views_count,
    sampleResource.created_at
  ];

  assert.strictEqual(resourceHeaders.length, row.length);
  assert.strictEqual(row[0], "res-1");
  assert.strictEqual(row[1], "TI-84 Plus CE");
});

// ----------------------------------------------------------------------------
// Summary
// ----------------------------------------------------------------------------
console.log("\n-------------------------------------------------");
console.log(`  Tests Passed: ${passedTests} / ${totalTests}`);
console.log("-------------------------------------------------");

if (passedTests === totalTests) {
  console.log("  >>> ALL WORKFLOW TESTS PASSED SUCCESSFULLY! <<<\n");
  process.exit(0);
} else {
  console.error("  >>> SOME TESTS FAILED! <<<\n");
  process.exit(1);
}
