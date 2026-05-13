import { useState } from 'react';
import { useAppState } from '../hooks/useAppState.jsx';

const TABS = [
  { id: 'goal', label: 'Goal Task' },
  { id: 'general', label: 'General Task' },
];

export default function AddTaskForm({ date, goals }) {
  const { dispatch } = useAppState();
  const [tab, setTab] = useState('goal');
  const [name, setName] = useState('');
  const [goalId, setGoalId] = useState('');
  const [subgoalId, setSubgoalId] = useState('');
  const [hours, setHours] = useState('');

  const selectedGoal = goals.find((g) => g.id === goalId);

  function reset() {
    setName('');
    setGoalId('');
    setSubgoalId('');
    setHours('');
  }

  function submit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    const task =
      tab === 'goal'
        ? {
            id: `t_${Date.now()}`,
            type: 'goal',
            name: trimmed,
            completed: false,
            goalId: goalId || null,
            subgoalId: subgoalId || null,
            hours: Number(hours) || 0,
          }
        : {
            id: `t_${Date.now()}`,
            type: 'general',
            name: trimmed,
            completed: false,
            goalId: null,
            subgoalId: null,
            hours: null,
          };

    dispatch({ type: 'ADD_TASK', payload: { date, task } });
    reset();
  }

  return (
    <form className="add-task" onSubmit={submit}>
      <div className="add-task__tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={
              'add-task__tab' + (tab === t.id ? ' add-task__tab--active' : '')
            }
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="add-task__row">
        <input
          className="input add-task__name"
          type="text"
          placeholder={tab === 'goal' ? 'What did you work on?' : 'What did you do?'}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {tab === 'goal' && (
          <>
            <select
              className="input"
              value={goalId}
              onChange={(e) => {
                setGoalId(e.target.value);
                setSubgoalId('');
              }}
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
              value={subgoalId}
              onChange={(e) => setSubgoalId(e.target.value)}
              disabled={!selectedGoal}
            >
              <option value="">Subgoal…</option>
              {selectedGoal?.subgoals.map((s) => (
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
              placeholder="hrs"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
          </>
        )}

        <button type="submit" className="btn btn--primary btn--sm">
          Add
        </button>
      </div>
    </form>
  );
}
