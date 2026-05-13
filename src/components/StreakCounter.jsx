import { useAppState } from '../hooks/useAppState.jsx';
import { currentStreak } from '../lib/calculations.js';

function FlameIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2c0 4-5 5-5 11 0 3.3 2.2 5 5 5s5-1.7 5-5c0-3-2-4-3-6 0 1.2-1 2-2 2-1.5 0-1-2.2 0-7z" />
    </svg>
  );
}

export default function StreakCounter() {
  const { state } = useAppState();
  const s = currentStreak(state);
  return (
    <div className={'streak' + (s > 0 ? ' streak--active' : '')}>
      <FlameIcon />
      <span className="streak__count">{s}</span>
      <span className="streak__label">day{s === 1 ? '' : 's'}</span>
    </div>
  );
}
