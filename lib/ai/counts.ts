import type {
  Need,
  NeedState,
  NeedType,
  TataDestination,
  User,
  Week,
  WeekItemState,
  WeekShape,
  WeeklyCounts,
} from "@/lib/types";
import { NEED_STATES, NEED_TYPES, TATA_DESTINATIONS, WEEK_ITEM_STATES, WEEK_SHAPES } from "@/lib/types";

function empty<T extends string>(keys: readonly T[]): Record<T, number> {
  const counts = {} as Record<T, number>;
  for (const key of keys) counts[key] = 0;
  return counts;
}

export function buildCounts(user: User, week: Week, needs: Need[]): WeeklyCounts {
  const itemsByState = empty<WeekItemState>(WEEK_ITEM_STATES);
  const itemsByType = empty<WeekShape>(WEEK_SHAPES);
  const itemsByDay = week.days.map((date) => ({ date, count: 0 }));
  const needsByState = empty<NeedState>(NEED_STATES);
  const needsByType = empty<NeedType>(NEED_TYPES);
  const demoResolutionsByDestination = empty<TataDestination>(TATA_DESTINATIONS);

  for (const item of week.items) {
    itemsByState[item.state] += 1;
    itemsByType[item.type] += 1;
    const day = itemsByDay.find((entry) => entry.date === item.day);
    if (day) day.count += 1;
  }
  for (const need of needs) {
    needsByState[need.state] += 1;
    needsByType[need.type] += 1;
    if (need.resolution) demoResolutionsByDestination[need.resolution.destination] += 1;
  }

  return {
    weekStartsOn: week.startsOn,
    weekEndsOn: week.endsOn,
    livingSituation: user.livingSituation,
    weekShapes: user.weekShapes,
    helpWith: user.helpWith,
    itemsByState,
    itemsByType,
    itemsByDay,
    needsByState,
    needsByType,
    demoResolutionsByDestination,
  };
}
