import { ImpactBadge, ResourceCategory } from "@/types";

export interface CategoryImpactEstimate {
  avgCo2Kg: number;
  avgCostSavedUsd: number;
  methodologyNote: string;
}

// Transparent defensible benchmark metrics per category
export const CATEGORY_IMPACT_METRICS: Record<ResourceCategory, CategoryImpactEstimate> = {
  "Books & Notes": {
    avgCo2Kg: 2.7,
    avgCostSavedUsd: 45,
    methodologyNote: "Based on EPA paper life-cycle and university textbook retail averages.",
  },
  "Lab Equipment": {
    avgCo2Kg: 11.5,
    avgCostSavedUsd: 85,
    methodologyNote: "Based on laboratory glassware/hardware manufacturing emissions and lab kit costs.",
  },
  "Electronics": {
    avgCo2Kg: 14.2,
    avgCostSavedUsd: 70,
    methodologyNote: "Based on consumer electronics lifecycle carbon footprint (e-waste avoidance).",
  },
  "Sports & Fitness": {
    avgCo2Kg: 5.8,
    avgCostSavedUsd: 35,
    methodologyNote: "Based on polymer/metal equipment manufacturing lifecycle analysis.",
  },
  "Stationery": {
    avgCo2Kg: 0.9,
    avgCostSavedUsd: 15,
    methodologyNote: "Based on stationary and writing supplies packaging and raw material lifecycle.",
  },
  "Decor & Events": {
    avgCo2Kg: 3.4,
    avgCostSavedUsd: 25,
    methodologyNote: "Based on single-use plastics and paper party decor reduction.",
  },
  "Other": {
    avgCo2Kg: 3.0,
    avgCostSavedUsd: 25,
    methodologyNote: "Standard circular economy campus item weighted average.",
  },
};

export const POINT_RULES = {
  loan_completed: {
    points: 20,
    label: "Successful Item Loan",
    description: "Lent an item to a campus peer and verified return.",
  },
  donation_completed: {
    points: 25,
    label: "Permanent Donation",
    description: "Donated a resource for free to keep it in campus circulation.",
  },
  exchange_completed: {
    points: 20,
    label: "Mutual Resource Swap",
    description: "Exchanged resources with a fellow student.",
  },
  need_fulfilled: {
    points: 10,
    label: "Fulfilled Campus Need",
    description: "Responded to and fulfilled a peer's requested need.",
  },
} as const;

export const BADGE_DEFINITIONS: Omit<ImpactBadge, "unlocked">[] = [
  {
    id: "first_loop",
    title: "First Loop",
    description: "Completed your first successful resource share or borrow.",
    icon: "Sparkles",
    minPoints: 20,
  },
  {
    id: "helpful_neighbor",
    title: "Helpful Neighbor",
    description: "Earned 50+ impact points by regularly helping campus peers.",
    icon: "HeartHandshake",
    minPoints: 50,
  },
  {
    id: "resource_saver",
    title: "Resource Saver",
    description: "Surpassed 100 points, keeping dozens of essential items out of landfills.",
    icon: "Recycle",
    minPoints: 100,
  },
  {
    id: "community_champion",
    title: "Community Champion",
    description: "Achieved top-tier 250+ impact points as a campus circular economy leader.",
    icon: "Trophy",
    minPoints: 250,
  },
];

export function computeBadges(points: number): ImpactBadge[] {
  return BADGE_DEFINITIONS.map((b) => ({
    ...b,
    unlocked: points >= b.minPoints,
  }));
}

export function calculateEstimatedSavings(
  category: ResourceCategory,
  quantity: number = 1
) {
  const metric = CATEGORY_IMPACT_METRICS[category] || CATEGORY_IMPACT_METRICS["Other"];
  const co2Kg = Number((metric.avgCo2Kg * Math.max(1, quantity)).toFixed(2));
  const costSaved = Math.round(metric.avgCostSavedUsd * Math.max(1, quantity));

  return {
    co2Kg,
    costSaved,
    note: metric.methodologyNote,
  };
}
