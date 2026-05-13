import { useEffect } from 'react';
import { useAppState } from '../hooks/useAppState.jsx';
import {
  RANKS,
  currentRank,
  daysLogged,
} from '../lib/calculations.js';

function rankIndex(name) {
  return RANKS.findIndex((r) => r.name === name);
}

export default function RankUpOverlay() {
  const { state, dispatch } = useAppState();
  const dl = daysLogged(state);
  const cur = currentRank(dl);
  const curName = cur?.name ?? 'Rookie';
  const last = state.lastSeenRank;

  useEffect(() => {
    if (last == null) {
      dispatch({ type: 'ACK_RANK', payload: curName });
    }
  }, [last, curName, dispatch]);

  if (last == null) return null;
  if (rankIndex(curName) <= rankIndex(last)) return null;

  function ack() {
    dispatch({ type: 'ACK_RANK', payload: curName });
  }

  return (
    <div className="rank-up" role="dialog" aria-modal="true">
      <div className="rank-up__panel">
        <p className="rank-up__eyebrow">Rank up</p>
        <h2 className="rank-up__name">{curName}</h2>
        <p className="rank-up__sub">
          {dl} day{dl === 1 ? '' : 's'} logged
        </p>
        <button type="button" className="btn btn--primary" onClick={ack}>
          Continue
        </button>
      </div>
    </div>
  );
}
