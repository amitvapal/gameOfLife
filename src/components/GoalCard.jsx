import { useState } from 'react';
import { useAppState } from '../hooks/useAppState.jsx';
import PinIcon from './PinIcon.jsx';
import SubgoalRow from './SubgoalRow.jsx';
import SubgoalFormModal from './SubgoalFormModal.jsx';

function formatDeadline(d) {
  if (!d) return '—';
  return d;
}

export default function GoalCard({ goal, onEdit }) {
  const { dispatch } = useAppState();
  const [expanded, setExpanded] = useState(true);
  const [subgoalModal, setSubgoalModal] = useState({ open: false, editing: null });

  const subgoals = [...goal.subgoals].sort(
    (a, b) => a.orderIndex - b.orderIndex
  );

  function togglePin() {
    dispatch({ type: 'TOGGLE_PIN_GOAL', payload: goal.id });
  }

  function remove() {
    if (confirm(`Delete goal "${goal.name}" and all its subgoals?`)) {
      dispatch({ type: 'DELETE_GOAL', payload: goal.id });
    }
  }

  function openNewSubgoal() {
    setSubgoalModal({ open: true, editing: null });
  }

  function openEditSubgoal(subgoal) {
    setSubgoalModal({ open: true, editing: subgoal });
  }

  function closeSubgoalModal() {
    setSubgoalModal({ open: false, editing: null });
  }

  function submitSubgoal(values) {
    if (subgoalModal.editing) {
      dispatch({
        type: 'UPDATE_SUBGOAL',
        payload: {
          goalId: goal.id,
          subgoalId: subgoalModal.editing.id,
          changes: values,
        },
      });
    } else {
      dispatch({
        type: 'ADD_SUBGOAL',
        payload: {
          goalId: goal.id,
          subgoal: {
            id: `sg_${Date.now()}`,
            name: values.name,
            orderIndex: subgoals.length,
            hoursEstimate: values.hoursEstimate,
            status: 'not_started',
            pinnedToDashboard: false,
          },
        },
      });
    }
    closeSubgoalModal();
  }

  function reorder(subgoalId, direction) {
    const ids = subgoals.map((s) => s.id);
    const i = ids.indexOf(subgoalId);
    const j = direction === 'up' ? i - 1 : i + 1;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    dispatch({
      type: 'REORDER_SUBGOALS',
      payload: { goalId: goal.id, orderedIds: ids },
    });
  }

  return (
    <article className="goal-card">
      <header className="goal-card__header">
        <button
          type="button"
          className="goal-card__toggle"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          {expanded ? '▾' : '▸'}
        </button>
        <h3 className="goal-card__name">{goal.name}</h3>
        <button
          type="button"
          className={`icon-btn${goal.pinnedToDashboard ? ' icon-btn--active' : ''}`}
          onClick={togglePin}
          aria-label={goal.pinnedToDashboard ? 'Unpin from dashboard' : 'Pin to dashboard'}
          title={goal.pinnedToDashboard ? 'Unpin' : 'Pin'}
        >
          <PinIcon filled={goal.pinnedToDashboard} />
        </button>
        <div className="goal-card__actions">
          <button type="button" className="btn btn--ghost btn--sm" onClick={onEdit}>
            Edit
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--sm btn--danger"
            onClick={remove}
          >
            Delete
          </button>
        </div>
      </header>

      <dl className="goal-card__meta">
        <div>
          <dt>Total</dt>
          <dd>{goal.totalHoursEstimate}h</dd>
        </div>
        <div>
          <dt>Weekly target</dt>
          <dd>{goal.weeklyTargetHours}h</dd>
        </div>
        <div>
          <dt>Deadline</dt>
          <dd>{formatDeadline(goal.deadline)}</dd>
        </div>
        <div>
          <dt>Subgoals</dt>
          <dd>{subgoals.length}</dd>
        </div>
      </dl>

      {expanded && (
        <div className="goal-card__subgoals">
          {subgoals.length === 0 ? (
            <p className="muted">No subgoals yet.</p>
          ) : (
            <div className="subgoal-list">
              {subgoals.map((sg, i) => (
                <SubgoalRow
                  key={sg.id}
                  goalId={goal.id}
                  subgoal={sg}
                  isFirst={i === 0}
                  isLast={i === subgoals.length - 1}
                  onEdit={() => openEditSubgoal(sg)}
                  onMoveUp={() => reorder(sg.id, 'up')}
                  onMoveDown={() => reorder(sg.id, 'down')}
                />
              ))}
            </div>
          )}
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={openNewSubgoal}
          >
            + Add subgoal
          </button>
        </div>
      )}

      <SubgoalFormModal
        open={subgoalModal.open}
        initialSubgoal={subgoalModal.editing}
        onSubmit={submitSubgoal}
        onClose={closeSubgoalModal}
      />
    </article>
  );
}
