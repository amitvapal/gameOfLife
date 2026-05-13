import { useState } from 'react';
import { useAppState } from '../hooks/useAppState.jsx';

export default function TaskRow({ date, task, goals }) {
  const { dispatch } = useAppState();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: task.name,
    hours: task.hours ?? '',
    goalId: task.goalId ?? '',
    subgoalId: task.subgoalId ?? '',
  });

  const goal =
    task.type === 'goal' && task.goalId
      ? goals.find((g) => g.id === task.goalId)
      : null;
  const subgoal =
    goal && task.subgoalId
      ? goal.subgoals.find((s) => s.id === task.subgoalId)
      : null;

  function toggleComplete() {
    dispatch({ type: 'TOGGLE_TASK_COMPLETE', payload: { date, taskId: task.id } });
  }

  function remove() {
    dispatch({ type: 'DELETE_TASK', payload: { date, taskId: task.id } });
  }

  function openEdit() {
    setForm({
      name: task.name,
      hours: task.hours ?? '',
      goalId: task.goalId ?? '',
      subgoalId: task.subgoalId ?? '',
    });
    setEditing(true);
  }

  function save(e) {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return;
    const changes = { name };
    if (task.type === 'goal') {
      changes.hours = Number(form.hours) || 0;
      changes.goalId = form.goalId || null;
      changes.subgoalId = form.subgoalId || null;
    }
    dispatch({
      type: 'UPDATE_TASK',
      payload: { date, taskId: task.id, changes },
    });
    setEditing(false);
  }

  if (editing) {
    const editGoal = goals.find((g) => g.id === form.goalId);
    return (
      <form className="task-row task-row--editing" onSubmit={save}>
        <input
          className="input"
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          autoFocus
          required
        />
        {task.type === 'goal' && (
          <>
            <select
              className="input"
              value={form.goalId}
              onChange={(e) =>
                setForm({ ...form, goalId: e.target.value, subgoalId: '' })
              }
            >
              <option value="">Goal…</option>
              {goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            <select
              className="input"
              value={form.subgoalId}
              onChange={(e) => setForm({ ...form, subgoalId: e.target.value })}
              disabled={!editGoal}
            >
              <option value="">Subgoal…</option>
              {editGoal?.subgoals.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <input
              className="input input--narrow"
              type="number"
              min="0"
              step="0.25"
              value={form.hours}
              onChange={(e) => setForm({ ...form, hours: e.target.value })}
              placeholder="hrs"
            />
          </>
        )}
        <button type="submit" className="btn btn--primary btn--sm">
          Save
        </button>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => setEditing(false)}
        >
          Cancel
        </button>
      </form>
    );
  }

  return (
    <div className="task-row">
      <input
        type="checkbox"
        className="task-row__checkbox"
        checked={task.completed}
        onChange={toggleComplete}
        aria-label="Toggle complete"
      />
      <button
        type="button"
        className={
          'task-row__body' + (task.completed ? ' task-row__body--done' : '')
        }
        onClick={openEdit}
      >
        <span className="task-row__name">{task.name}</span>
        {goal && (
          <span className="task-row__tag">
            {goal.name}
            {subgoal ? ` › ${subgoal.name}` : ''}
          </span>
        )}
        {task.hours != null && task.type === 'goal' && (
          <span className="task-row__hours">{task.hours}h</span>
        )}
      </button>
      <button
        type="button"
        className="icon-btn"
        onClick={remove}
        aria-label="Delete task"
        title="Delete"
      >
        ×
      </button>
    </div>
  );
}
