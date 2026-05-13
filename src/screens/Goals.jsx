import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState.jsx';
import GoalCard from '../components/GoalCard.jsx';
import GoalFormModal from '../components/GoalFormModal.jsx';

export default function Goals() {
  const { state, dispatch } = useAppState();
  const [modal, setModal] = useState({ open: false, editing: null });
  const [searchParams, setSearchParams] = useSearchParams();
  const focusId = searchParams.get('focus');
  const [highlightId, setHighlightId] = useState(null);

  useEffect(() => {
    if (!focusId) return;
    setHighlightId(focusId);
    const el = document.querySelector(`[data-goal-id="${focusId}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const t = setTimeout(() => {
      setHighlightId(null);
      setSearchParams({}, { replace: true });
    }, 1800);
    return () => clearTimeout(t);
  }, [focusId, setSearchParams]);

  function openNew() {
    setModal({ open: true, editing: null });
  }

  function openEdit(goal) {
    setModal({ open: true, editing: goal });
  }

  function close() {
    setModal({ open: false, editing: null });
  }

  function submit(values) {
    if (modal.editing) {
      dispatch({
        type: 'UPDATE_GOAL',
        payload: { id: modal.editing.id, changes: values },
      });
    } else {
      dispatch({
        type: 'ADD_GOAL',
        payload: {
          id: `goal_${Date.now()}`,
          name: values.name,
          totalHoursEstimate: values.totalHoursEstimate,
          weeklyTargetHours: values.weeklyTargetHours,
          deadline: values.deadline,
          pinnedToDashboard: false,
          createdAt: new Date().toISOString(),
          subgoals: [],
        },
      });
    }
    close();
  }

  return (
    <section className="goals">
      <header className="screen-header">
        <h2>Goals</h2>
        <button type="button" className="btn btn--primary" onClick={openNew}>
          + New Goal
        </button>
      </header>

      {state.goals.length === 0 ? (
        <div className="empty-state">
          No goals yet. Create your first one to get started.
        </div>
      ) : (
        <div className="goal-list">
          {state.goals.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              onEdit={() => openEdit(g)}
              highlighted={highlightId === g.id}
            />
          ))}
        </div>
      )}

      <GoalFormModal
        open={modal.open}
        initialGoal={modal.editing}
        onSubmit={submit}
        onClose={close}
      />
    </section>
  );
}
