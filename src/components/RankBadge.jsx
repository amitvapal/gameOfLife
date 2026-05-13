import { useAppState } from '../hooks/useAppState.jsx';
import {
  currentRank,
  daysLogged,
  nextRank,
  progressToNextRank,
} from '../lib/calculations.js';

export default function RankBadge() {
  const { state } = useAppState();
  const dl = daysLogged(state);
  const rank = currentRank(dl);
  const next = nextRank(dl);
  const progress = progressToNextRank(dl);

  return (
    <div className="rank-badge">
      <div className="rank-badge__name">{rank?.name ?? 'Rookie'}</div>
      <div className="rank-badge__days">
        {dl} day{dl === 1 ? '' : 's'} logged
      </div>
      <div className="rank-badge__bar">
        <div
          className="rank-badge__fill"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
      <div className="rank-badge__next">
        {next ? `${next.min - dl} to ${next.name}` : 'Max rank'}
      </div>
    </div>
  );
}
