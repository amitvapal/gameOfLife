import { useMemo, useState } from 'react';
import { useAppState } from '../hooks/useAppState.jsx';
import FitnessSetup from '../components/FitnessSetup.jsx';
import FitnessStats from '../components/FitnessStats.jsx';
import WeighInForm from '../components/WeighInForm.jsx';
import MacroLog from '../components/MacroLog.jsx';
import FitnessTargetsModal from '../components/FitnessTargetsModal.jsx';

function byDateDesc(a, b) {
  return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
}

export default function Fitness() {
  const { state, dispatch } = useAppState();
  const [targetsOpen, setTargetsOpen] = useState(false);

  const fitness = state.fitness;

  const sortedWeighIns = useMemo(() => {
    if (!fitness) return [];
    return fitness.weighIns
      .map((w, i) => ({ ...w, _index: i }))
      .sort(byDateDesc);
  }, [fitness]);

  const sortedMacroLogs = useMemo(() => {
    if (!fitness) return [];
    return [...fitness.dailyLogs].sort(byDateDesc);
  }, [fitness]);

  if (!fitness) {
    return (
      <section className="fitness">
        <header className="screen-header">
          <h2>Fitness</h2>
        </header>
        <FitnessSetup />
      </section>
    );
  }

  return (
    <section className="fitness">
      <header className="screen-header">
        <h2>Fitness</h2>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => setTargetsOpen(true)}
        >
          Edit targets
        </button>
      </header>

      <FitnessStats fitness={fitness} />

      <section className="fitness__section">
        <h3 className="today__section-title">Weigh-ins</h3>
        <WeighInForm />
        {sortedWeighIns.length === 0 ? (
          <p className="muted">No weigh-ins yet.</p>
        ) : (
          <div className="log-list">
            {sortedWeighIns.map((w) => (
              <div key={`${w.date}-${w._index}`} className="log-row">
                <span className="log-row__date">{w.date}</span>
                <span className="log-row__value">{w.weight} lbs</span>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() =>
                    dispatch({ type: 'DELETE_WEIGHIN', payload: w._index })
                  }
                  aria-label="Delete weigh-in"
                  title="Delete"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="fitness__section">
        <h3 className="today__section-title">Macros</h3>
        <MacroLog />
        {sortedMacroLogs.length === 0 ? (
          <p className="muted">No macros logged yet.</p>
        ) : (
          <div className="log-list">
            {sortedMacroLogs.map((l) => (
              <div key={l.date} className="log-row log-row--macros">
                <span className="log-row__date">{l.date}</span>
                <span className="log-row__value">{l.calories} cal</span>
                <span className="log-row__sub">
                  P {l.protein} · C {l.carbs} · F {l.fat}
                </span>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() =>
                    dispatch({ type: 'DELETE_MACRO_LOG', payload: l.date })
                  }
                  aria-label="Delete macro log"
                  title="Delete"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <FitnessTargetsModal
        open={targetsOpen}
        onClose={() => setTargetsOpen(false)}
      />
    </section>
  );
}
