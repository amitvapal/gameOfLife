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

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...initialState, ...action.payload };
    case 'RESET_STATE':
      return { ...initialState, createdAt: new Date().toISOString() };
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
