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
