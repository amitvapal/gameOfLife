import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import { storage } from '../lib/storage.js';

const STORAGE_KEY = 'game-of-life-state';

const initialState = {
  version: 1,
  createdAt: null,
  goals: [],
  fitness: null,
  dailyLogs: {},
};

const NEXT_STATUS = {
  not_started: 'in_progress',
  in_progress: 'done',
  done: 'not_started',
};

function mapGoal(state, goalId, fn) {
  return {
    ...state,
    goals: state.goals.map((g) => (g.id === goalId ? fn(g) : g)),
  };
}

function mapSubgoal(state, goalId, subgoalId, fn) {
  return mapGoal(state, goalId, (g) => ({
    ...g,
    subgoals: g.subgoals.map((s) => (s.id === subgoalId ? fn(s) : s)),
  }));
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...initialState, ...action.payload };
    case 'RESET_STATE':
      return { ...initialState, createdAt: new Date().toISOString() };

    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };

    case 'UPDATE_GOAL': {
      const { id, changes } = action.payload;
      return mapGoal(state, id, (g) => ({ ...g, ...changes }));
    }

    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter((g) => g.id !== action.payload),
      };

    case 'ADD_SUBGOAL': {
      const { goalId, subgoal } = action.payload;
      return mapGoal(state, goalId, (g) => ({
        ...g,
        subgoals: [...g.subgoals, subgoal],
      }));
    }

    case 'UPDATE_SUBGOAL': {
      const { goalId, subgoalId, changes } = action.payload;
      return mapSubgoal(state, goalId, subgoalId, (s) => ({ ...s, ...changes }));
    }

    case 'DELETE_SUBGOAL': {
      const { goalId, subgoalId } = action.payload;
      return mapGoal(state, goalId, (g) => ({
        ...g,
        subgoals: g.subgoals
          .filter((s) => s.id !== subgoalId)
          .map((s, i) => ({ ...s, orderIndex: i })),
      }));
    }

    case 'CYCLE_SUBGOAL_STATUS': {
      const { goalId, subgoalId } = action.payload;
      return mapSubgoal(state, goalId, subgoalId, (s) => ({
        ...s,
        status: NEXT_STATUS[s.status] || 'in_progress',
      }));
    }

    case 'REORDER_SUBGOALS': {
      const { goalId, orderedIds } = action.payload;
      return mapGoal(state, goalId, (g) => {
        const byId = new Map(g.subgoals.map((s) => [s.id, s]));
        const next = orderedIds
          .map((id, i) => {
            const sg = byId.get(id);
            return sg ? { ...sg, orderIndex: i } : null;
          })
          .filter(Boolean);
        return { ...g, subgoals: next };
      });
    }

    case 'TOGGLE_PIN_GOAL':
      return mapGoal(state, action.payload, (g) => ({
        ...g,
        pinnedToDashboard: !g.pinnedToDashboard,
      }));

    case 'TOGGLE_PIN_SUBGOAL': {
      const { goalId, subgoalId } = action.payload;
      return mapSubgoal(state, goalId, subgoalId, (s) => ({
        ...s,
        pinnedToDashboard: !s.pinnedToDashboard,
      }));
    }

    default:
      return state;
  }
}

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const hydrated = useRef(false);
  const writeTimer = useRef(null);

  useEffect(() => {
    const saved = storage.get(STORAGE_KEY);
    if (saved) dispatch({ type: 'LOAD_STATE', payload: saved });
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    if (writeTimer.current) clearTimeout(writeTimer.current);
    writeTimer.current = setTimeout(() => {
      storage.set(STORAGE_KEY, state);
    }, 500);
    return () => {
      if (writeTimer.current) clearTimeout(writeTimer.current);
    };
  }, [state]);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
