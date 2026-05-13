import { useAppState } from '../hooks/useAppState.jsx';
import PinIcon from './PinIcon.jsx';

const STATUS_LABEL = {
  not_started: 'Todo',
  in_progress: 'Doing',
  done: 'Done',
};

export default function SubgoalRow({
  goalId,
  subgoal,
  isFirst,
  isLast,
  onEdit,
  onMoveUp,
  onMoveDown,
}) {
  const { dispatch } = useAppState();

  function cycleStatus() {
    dispatch({
      type: 'CYCLE_SUBGOAL_STATUS',
      payload: { goalId, subgoalId: subgoal.id },
    });
  }

  function togglePin() {
    dispatch({
      type: 'TOGGLE_PIN_SUBGOAL',
      payload: { goalId, subgoalId: subgoal.id },
    });
  }

  function remove() {
    if (confirm(`Delete subgoal "${subgoal.name}"?`)) {
      dispatch({
        type: 'DELETE_SUBGOAL',
        payload: { goalId, subgoalId: subgoal.id },
      });
    }
  }

  return (
    <div className="subgoal">
      <button
        type="button"
        className={`status-pill status-pill--${subgoal.status}`}
        onClick={cycleStatus}
        aria-label={`Status: ${STATUS_LABEL[subgoal.status]}. Click to cycle.`}
        title={STATUS_LABEL[subgoal.status]}
      />
      <div className="subgoal__body">
        <div className="subgoal__name">{subgoal.name}</div>
        <div className="subgoal__meta">{subgoal.hoursEstimate}h</div>
      </div>
      <div className="subgoal__actions">
        <button
          type="button"
          className={`icon-btn${subgoal.pinnedToDashboard ? ' icon-btn--active' : ''}`}
          onClick={togglePin}
          aria-label={subgoal.pinnedToDashboard ? 'Unpin from dashboard' : 'Pin to dashboard'}
          title={subgoal.pinnedToDashboard ? 'Unpin' : 'Pin'}
        >
          <PinIcon filled={subgoal.pinnedToDashboard} />
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={onMoveUp}
          disabled={isFirst}
          aria-label="Move up"
          title="Move up"
        >
          ↑
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={onMoveDown}
          disabled={isLast}
          aria-label="Move down"
          title="Move down"
        >
          ↓
        </button>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={onEdit}
        >
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
    </div>
  );
}
