import { useMemo } from 'react';
import { useAppState } from './useAppState.jsx';
import {
  accumulatedDeficit,
  fitnessProgress,
  goalProgress,
  latestWeighIn,
  subgoalProgress,
  sumHoursForGoal,
  sumHoursForSubgoal,
  totalDeficitNeeded,
} from '../lib/calculations.js';

export default function useDashboardRings() {
  const { state } = useAppState();

  return useMemo(() => {
    const goalRings = state.goals.map((g) => ({
      id: g.id,
      name: g.name,
      progress: goalProgress(state, g.id),
      hoursLogged: sumHoursForGoal(state, g.id),
      hoursTotal: g.totalHoursEstimate,
    }));

    const subgoalRings = [];
    for (const g of state.goals) {
      for (const s of g.subgoals) {
        if (!s.pinnedToDashboard) continue;
        subgoalRings.push({
          id: s.id,
          name: s.name,
          goalId: g.id,
          goalName: g.name,
          progress: subgoalProgress(state, s.id),
          hoursLogged: sumHoursForSubgoal(state, s.id),
          hoursTotal: s.hoursEstimate,
        });
      }
    }

    let fitnessRing = null;
    if (state.fitness) {
      const f = state.fitness;
      const latest = latestWeighIn(f);
      const currentWeight = latest ? latest.weight : f.startWeight;
      fitnessRing = {
        progress: fitnessProgress(f),
        accumulated: accumulatedDeficit(f),
        needed: totalDeficitNeeded(f),
        lbsLost: f.startWeight - currentWeight,
        lbsToLose: f.startWeight - f.goalWeight,
      };
    }

    return { goalRings, subgoalRings, fitnessRing };
  }, [state]);
}
