import {
  accumulatedDeficit,
  dailyDeficitNeeded,
  fitnessProgress,
  latestWeighIn,
  totalDeficitNeeded,
} from '../lib/calculations.js';

function fmtNum(n, digits = 0) {
  if (n == null || Number.isNaN(n)) return '—';
  return n.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export default function FitnessStats({ fitness }) {
  const latest = latestWeighIn(fitness);
  const currentWeight = latest ? latest.weight : fitness.startWeight;
  const lost = fitness.startWeight - currentWeight;
  const deficit = accumulatedDeficit(fitness);
  const needed = totalDeficitNeeded(fitness);
  const daily = dailyDeficitNeeded(fitness);
  const progress = fitnessProgress(fitness);

  return (
    <div className="stats">
      <div className="stats__tiles">
        <Tile label="Current weight" value={`${fmtNum(currentWeight, 1)} lbs`} />
        <Tile
          label="Weight lost"
          value={`${fmtNum(lost, 1)} lbs`}
          sub={`Goal: ${fmtNum(fitness.goalWeight, 1)} lbs`}
        />
        <Tile
          label="Deficit accumulated"
          value={`${fmtNum(deficit)} cal`}
          sub={`of ${fmtNum(needed)} needed`}
        />
        <Tile
          label="Daily deficit needed"
          value={daily == null ? '—' : `${fmtNum(daily)} cal`}
          sub={fitness.targetDate ? `by ${fitness.targetDate}` : 'No target date'}
        />
      </div>
      <div className="stats__progress">
        <div className="stats__progress-bar">
          <div
            className="stats__progress-fill"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
        <div className="stats__progress-label">
          {Math.round(progress * 100)}% to goal
        </div>
      </div>
    </div>
  );
}

function Tile({ label, value, sub }) {
  return (
    <div className="tile">
      <div className="tile__label">{label}</div>
      <div className="tile__value">{value}</div>
      {sub && <div className="tile__sub">{sub}</div>}
    </div>
  );
}
