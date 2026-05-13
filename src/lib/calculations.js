import { formatDate } from './dates.js';

export const RANKS = [
  { name: 'Rookie', min: 0, max: 13 },
  { name: 'Contender', min: 14, max: 41 },
  { name: 'Operator', min: 42, max: 90 },
  { name: 'Elite', min: 91, max: 180 },
  { name: 'Legend', min: 181, max: Infinity },
];

export function currentRank(daysLogged) {
  return RANKS.find((r) => daysLogged >= r.min && daysLogged <= r.max);
}

export function nextRank(daysLogged) {
  const i = RANKS.findIndex(
    (r) => daysLogged >= r.min && daysLogged <= r.max
  );
  return i >= 0 && i < RANKS.length - 1 ? RANKS[i + 1] : null;
}

export function progressToNextRank(daysLogged) {
  const cur = currentRank(daysLogged);
  const next = nextRank(daysLogged);
  if (!next || !cur) return 1;
  const span = next.min - cur.min;
  if (span <= 0) return 1;
  return Math.min(1, Math.max(0, (daysLogged - cur.min) / span));
}

function dayHasData(log) {
  if (!log) return false;
  const hasTaskCompleted = log.tasks?.some((t) => t.completed);
  const hasRating = log.rating != null;
  const hasReflection =
    log.reflection && log.reflection.trim().length > 0;
  return Boolean(hasTaskCompleted || hasRating || hasReflection);
}

export function daysLogged(state) {
  let count = 0;
  for (const date in state.dailyLogs) {
    if (dayHasData(state.dailyLogs[date])) count++;
  }
  return count;
}

export function currentStreak(state) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const has = (d) => dayHasData(state.dailyLogs[formatDate(d)]);

  let cursor = new Date(today);
  if (!has(cursor)) {
    cursor.setDate(cursor.getDate() - 1);
    if (!has(cursor)) return 0;
  }

  let streak = 0;
  while (has(cursor)) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function sumHoursForGoal(state, goalId) {
  let total = 0;
  for (const date in state.dailyLogs) {
    for (const t of state.dailyLogs[date].tasks) {
      if (t.completed && t.type === 'goal' && t.goalId === goalId) {
        total += Number(t.hours) || 0;
      }
    }
  }
  return total;
}

export function sumHoursForSubgoal(state, subgoalId) {
  let total = 0;
  for (const date in state.dailyLogs) {
    for (const t of state.dailyLogs[date].tasks) {
      if (t.completed && t.type === 'goal' && t.subgoalId === subgoalId) {
        total += Number(t.hours) || 0;
      }
    }
  }
  return total;
}

export function totalDeficitNeeded(fitness) {
  const lbs = fitness.startWeight - fitness.goalWeight;
  return lbs * 3500;
}

export function accumulatedDeficit(fitness) {
  return fitness.dailyLogs.reduce((sum, log) => {
    const diff = fitness.dailyCalorieTarget - log.calories;
    return sum + Math.max(0, diff);
  }, 0);
}

export function fitnessProgress(fitness) {
  const needed = totalDeficitNeeded(fitness);
  if (needed <= 0) return 0;
  return Math.min(1, accumulatedDeficit(fitness) / needed);
}

export function dailyDeficitNeeded(fitness) {
  if (!fitness.targetDate) return null;
  const start = new Date(fitness.startDate);
  const target = new Date(fitness.targetDate);
  const days = Math.max(1, (target - start) / 86400000);
  return totalDeficitNeeded(fitness) / days;
}

export function goalProgress(state, goalId) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal || !goal.totalHoursEstimate) return 0;
  return Math.min(1, sumHoursForGoal(state, goalId) / goal.totalHoursEstimate);
}

export function subgoalProgress(state, subgoalId) {
  let sg = null;
  for (const g of state.goals) {
    const found = g.subgoals.find((s) => s.id === subgoalId);
    if (found) {
      sg = found;
      break;
    }
  }
  if (!sg || !sg.hoursEstimate) return 0;
  return Math.min(1, sumHoursForSubgoal(state, subgoalId) / sg.hoursEstimate);
}

export function latestWeighIn(fitness) {
  if (!fitness.weighIns.length) return null;
  return [...fitness.weighIns].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0
  )[0];
}
