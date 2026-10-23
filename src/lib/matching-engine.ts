import { MatchCriteria, MatchResult, MatchScoreBreakdown, MatchTier, Resource } from "@/types";

// Common English stopwords to ignore in keyword similarity
const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from",
  "has", "he", "in", "is", "it", "its", "of", "on", "that", "the",
  "to", "was", "were", "will", "with", "i", "need", "looking", "want",
  "urgent", "please", "can", "anyone", "have", "some", "any", "item"
]);

/**
 * Tokenize string into cleaned lowercase alphanumeric terms
 */
export function extractKeywords(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

/**
 * Calculate Jaccard similarity and token overlap between query terms and resource text
 */
export function calculateTextOverlap(queryTerms: string[], targetText: string): { ratio: number; matchedWords: string[] } {
  if (queryTerms.length === 0 || !targetText) {
    return { ratio: 0, matchedWords: [] };
  }

  const targetTokens = new Set(extractKeywords(targetText));
  const matchedWords: string[] = [];

  for (const term of queryTerms) {
    if (targetTokens.has(term)) {
      matchedWords.push(term);
    } else {
      // Fuzzy partial match check (e.g. "calc" in "calculator" or "micro" in "microcontroller")
      for (const tToken of Array.from(targetTokens)) {
        if (
          (tToken.length >= 4 && term.length >= 4 && (tToken.includes(term) || term.includes(tToken)))
        ) {
          matchedWords.push(`${term}~${tToken}`);
          break;
        }
      }
    }
  }

  const ratio = matchedWords.length / queryTerms.length;
  return { ratio: Math.min(ratio, 1.0), matchedWords };
}

/**
 * Check if the resource availability window covers the requested dates
 */
export function evaluateDateOverlap(
  resFrom?: string,
  resUntil?: string,
  reqFrom?: string,
  reqUntil?: string
): { isCompatible: boolean; explanation: string } {
  // If either has no strict dates, it is considered flexible and compatible
  if (!reqFrom && !reqUntil) {
    return { isCompatible: true, explanation: "Open/flexible request dates match item availability" };
  }
  if (!resFrom && !resUntil) {
    return { isCompatible: true, explanation: "Resource has perpetual/flexible availability" };
  }

  const rStart = reqFrom ? new Date(reqFrom).getTime() : null;
  const rEnd = reqUntil ? new Date(reqUntil).getTime() : null;
  const aStart = resFrom ? new Date(resFrom).getTime() : null;
  const aEnd = resUntil ? new Date(resUntil).getTime() : null;

  if (rStart && aStart && rStart < aStart) {
    return { isCompatible: false, explanation: "Needed earlier than item becomes available" };
  }
  if (rEnd && aEnd && rEnd > aEnd) {
    return { isCompatible: false, explanation: "Needed longer than item is offered" };
  }

  return { isCompatible: true, explanation: "Exact availability window matches your requested dates" };
}

/**
 * Transparent scoring algorithm without external APIs
 * Max Score = 100 points
 */
export function scoreResourceMatch(
  resource: Resource,
  criteria: MatchCriteria
): MatchScoreBreakdown {
  const reasons: string[] = [];
  let categoryScore = 0;
  let keywordSimilarityScore = 0;
  let dateAvailabilityScore = 0;
  let conditionScore = 0;
  let locationScore = 0;

  // 1. Category Matching (Max 35 pts)
  if (criteria.targetCategory && criteria.targetCategory.toLowerCase() === resource.category.toLowerCase()) {
    categoryScore = 35;
    reasons.push(`Exact category match in "${resource.category}" (+35%)`);
  } else if (!criteria.targetCategory) {
    categoryScore = 15;
    reasons.push("Broad search across all categories (+15%)");
  }

  // 2. Keyword & Text Similarity (Max 30 pts)
  const combinedResourceText = `${resource.title} ${resource.description}`;
  const { ratio: titleRatio, matchedWords: titleMatches } = calculateTextOverlap(criteria.targetKeywords, resource.title);
  const { ratio: fullRatio, matchedWords: allMatches } = calculateTextOverlap(criteria.targetKeywords, combinedResourceText);

  // Title matches carry higher weight than description
  const combinedRatio = Math.min(1.0, titleRatio * 0.7 + fullRatio * 0.3);
  keywordSimilarityScore = Math.round(combinedRatio * 30);

  if (keywordSimilarityScore > 0) {
    const uniqueMatches = Array.from(new Set([...titleMatches, ...allMatches])).slice(0, 4);
    reasons.push(
      `Keyword overlap in title/description (${uniqueMatches.join(", ")}) (+${keywordSimilarityScore}%)`
    );
  }

  // 3. Date Availability (Max 15 pts)
  const dateResult = evaluateDateOverlap(
    resource.available_from,
    resource.available_until,
    criteria.requestedFrom,
    criteria.requestedUntil
  );
  if (dateResult.isCompatible) {
    dateAvailabilityScore = 15;
    reasons.push(`${dateResult.explanation} (+15%)`);
  } else {
    reasons.push(`Note: ${dateResult.explanation} (0%)`);
  }

  // 4. Condition Fit (Max 10 pts)
  if (criteria.preferredCondition) {
    if (criteria.preferredCondition === resource.condition) {
      conditionScore = 10;
      reasons.push(`Condition exactly matches preferred (${resource.condition.replace("_", " ")}) (+10%)`);
    } else if (resource.condition === "new" || resource.condition === "like_new") {
      conditionScore = 8;
      reasons.push(`Resource condition is premium quality (${resource.condition.replace("_", " ")}) (+8%)`);
    } else {
      conditionScore = 4;
      reasons.push(`Condition acceptable (${resource.condition}) (+4%)`);
    }
  } else {
    conditionScore = 7;
    reasons.push(`Condition is verified (${resource.condition}) (+7%)`);
  }

  // 5. Campus Location Proximity (Max 10 pts)
  if (criteria.campusLocation && resource.pickup_location) {
    const locA = criteria.campusLocation.toLowerCase();
    const locB = resource.pickup_location.toLowerCase();
    if (locA === locB || locB.includes(locA) || locA.includes(locB)) {
      locationScore = 10;
      reasons.push(`Pickup location matches your campus zone (${resource.pickup_location}) (+10%)`);
    } else {
      locationScore = 4;
      reasons.push(`Campus pickup available at ${resource.pickup_location} (+4%)`);
    }
  } else {
    locationScore = 5;
    reasons.push(`Designated campus pickup location provided (+5%)`);
  }

  const totalScore = Math.min(
    100,
    categoryScore + keywordSimilarityScore + dateAvailabilityScore + conditionScore + locationScore
  );

  return {
    categoryScore,
    keywordSimilarityScore,
    dateAvailabilityScore,
    conditionScore,
    locationScore,
    totalScore,
    reasons,
  };
}

/**
 * Determine the tier based on final score
 */
export function getTierFromScore(score: number): MatchTier {
  if (score >= 75) return "Excellent Match";
  if (score >= 50) return "Good Match";
  return "Possible Match";
}

/**
 * Find and rank matches from a candidate pool of resources
 */
export function findMatchingResources(
  resources: Resource[],
  criteria: MatchCriteria,
  minThreshold: number = 30
): MatchResult[] {
  const results: MatchResult[] = [];

  for (const resource of resources) {
    // Exclude completed or unavailable items
    if (resource.status !== "available") continue;

    const breakdown = scoreResourceMatch(resource, criteria);
    if (breakdown.totalScore >= minThreshold) {
      results.push({
        resource,
        score: breakdown.totalScore,
        tier: getTierFromScore(breakdown.totalScore),
        breakdown,
      });
    }
  }

  // Sort by highest score descending
  return results.sort((a, b) => b.score - a.score);
}
