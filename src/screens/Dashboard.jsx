import { useNavigate } from 'react-router-dom';
import useDashboardRings from '../hooks/useDashboardRings.js';
import RingChart from '../components/RingChart.jsx';

function fmt(n, digits = 0) {
  if (n == null || Number.isNaN(n)) return '—';
  return n.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { goalRings, subgoalRings, fitnessRing } = useDashboardRings();

  function goToGoal(goalId) {
    navigate(`/goals?focus=${encodeURIComponent(goalId)}`);
  }

  return (
    <section className="dashboard">
      <header className="screen-header">
        <h2>Dashboard</h2>
      </header>

      <section className="dashboard__section">
        <h3 className="dashboard__heading">Goals</h3>
        {goalRings.length === 0 ? (
          <p className="muted">No goals yet — head to Goals to create one.</p>
        ) : (
          <div className="ring-row">
            {goalRings.map((r) => (
              <RingChart
                key={r.id}
                progress={r.progress}
                label={r.name}
                sublabel={`${fmt(r.hoursLogged, 1)} / ${fmt(r.hoursTotal)} h`}
                size={140}
                strokeWidth={12}
                onClick={() => goToGoal(r.id)}
              />
            ))}
          </div>
        )}
      </section>

      {subgoalRings.length > 0 && (
        <section className="dashboard__section">
          <h3 className="dashboard__heading">Pinned subgoals</h3>
          <div className="ring-row">
            {subgoalRings.map((r) => (
              <RingChart
                key={r.id}
                progress={r.progress}
                label={r.name}
                sublabel={`${r.goalName} · ${fmt(r.hoursLogged, 1)}/${fmt(r.hoursTotal)} h`}
                size={100}
                strokeWidth={10}
                onClick={() => goToGoal(r.goalId)}
              />
            ))}
          </div>
        </section>
      )}

      <section className="dashboard__section">
        <h3 className="dashboard__heading">Fitness</h3>
        {!fitnessRing ? (
          <p className="muted">
            Set up fitness tracking to see your deficit progress.
          </p>
        ) : (
          <div className="fitness-ring">
            <RingChart
              progress={fitnessRing.progress}
              label="Deficit progress"
              size={180}
              strokeWidth={14}
              onClick={() => navigate('/fitness')}
            />
            <div className="fitness-ring__stats">
              <p>
                <strong>
                  {fmt(fitnessRing.accumulated)} cal
                </strong>{' '}
                of {fmt(fitnessRing.needed)} cal deficit
              </p>
              <p>
                <strong>{fmt(fitnessRing.lbsLost, 1)} lbs</strong> of{' '}
                {fmt(fitnessRing.lbsToLose, 1)} lbs lost
              </p>
            </div>
          </div>
        )}
      </section>
    </section>
  );
}
