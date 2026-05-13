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

export function latestWeighIn(fitness) {
  if (!fitness.weighIns.length) return null;
  return [...fitness.weighIns].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0
  )[0];
}
