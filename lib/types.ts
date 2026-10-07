export const WEEK_SHAPES = [
  "classes",
  "food",
  "shopping",
  "travel",
  "fitness",
  "events",
  "study",
  "personal",
] as const;

export type WeekShape = (typeof WEEK_SHAPES)[number];

export const LIVING_SITUATIONS = [
  "with_family",
  "hostel",
  "pg",
  "shared_apartment",
] as const;

export type LivingSituation = (typeof LIVING_SITUATIONS)[number];

export const HELP_FOCUSES = [
  "see_the_week",
  "hold_a_need",
  "see_a_tata_stop",
] as const;

export type HelpFocus = (typeof HELP_FOCUSES)[number];

export const WEEK_ITEM_STATES = ["planned", "done"] as const;

export type WeekItemState = (typeof WEEK_ITEM_STATES)[number];

export const NEED_TYPES = [
  "buy",
  "book",
  "prepare",
  "remember",
  "replace",
  "plan",
] as const;

export type NeedType = (typeof NEED_TYPES)[number];

export const NEED_STATES = ["open", "resolved"] as const;

export type NeedState = (typeof NEED_STATES)[number];

export const TATA_DESTINATIONS = [
  "croma",
  "westside",
  "bigbasket",
  "tata_1mg",
  "travel",
  "ihcl",
  "neu_upi",
] as const;

export type TataDestination = (typeof TATA_DESTINATIONS)[number];

export interface User {
  id: "demo-ananya";
  displayName: "Ananya";
  isDemo: true;
  demoLabel: "DEMO DATA";
  livingSituation: LivingSituation | null;
  weekShapes: WeekShape[];
  helpWith: HelpFocus[];
  onboardingComplete: boolean;
  onboardingCompletedAt: string | null;
}

export interface Week {
  id: string;
  startsOn: string;
  endsOn: string;
  timeZone: "Asia/Kolkata";
  days: string[];
  items: WeekItem[];
}

export interface WeekItem {
  id: string;
  type: WeekShape;
  title: string;
  day: string;
  time: string | null;
  state: WeekItemState;
  tataDestination: TataDestination | null;
  createdAt: string;
  updatedAt: string;
}

export interface TataResolution {
  destination: TataDestination;
  label: string;
  isLive: false;
  demoOnly: true;
}

export interface Need {
  id: string;
  type: NeedType;
  title: string;
  state: NeedState;
  resolution: TataResolution | null;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyCounts {
  weekStartsOn: string;
  weekEndsOn: string;
  livingSituation: LivingSituation | null;
  weekShapes: WeekShape[];
  helpWith: HelpFocus[];
  itemsByState: Record<WeekItemState, number>;
  itemsByType: Record<WeekShape, number>;
  itemsByDay: { date: string; count: number }[];
  needsByState: Record<NeedState, number>;
  needsByType: Record<NeedType, number>;
  demoResolutionsByDestination: Record<TataDestination, number>;
}

export interface AIInsight {
  id: string;
  source: "gemini" | "fallback";
  text: string;
  counts: WeeklyCounts;
  cacheKey: string;
  generatedAt: string;
  fallbackReason: string | null;
}

export const ANALYTICS_EVENTS = [
  "neuplan_open",
  "neuplan_onboarding_complete",
  "week_view_open",
  "week_item_created",
  "week_item_completed",
  "need_created",
  "need_resolved",
  "tata_resolution_viewed",
  "tata_resolution_clicked",
  "ai_summary_generated",
  "ai_summary_fallback",
  "session_meaningful",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];

export interface AnalyticsProps {
  type?: string;
  state?: string;
  destination?: string;
  source?: string;
  reason?: string;
}

export interface AnalyticsEvent {
  id: string;
  name: AnalyticsEventName;
  props: AnalyticsProps;
  at: string;
}

export interface StoreFile {
  version: 1;
  user: User;
  items: WeekItem[];
  needs: Need[];
  insight: AIInsight | null;
  events: AnalyticsEvent[];
}
