import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState.jsx';
import { formatDate, today as dateToday } from '../lib/dates.js';
import Modal from '../components/Modal.jsx';
import Calendar from '../components/Calendar.jsx';
import TaskRow from '../components/TaskRow.jsx';
import AddTaskForm from '../components/AddTaskForm.jsx';
import Notes from '../components/Notes.jsx';

function prettyDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function logHasData(log) {
  if (!log) return false;
  return (
    log.tasks.length > 0 ||
    log.sleep != null ||
    log.rating != null ||
    (log.reflection && log.reflection.trim().length > 0)
  );
}

export default function Today() {
  const { state, dispatch } = useAppState();
  const [searchParams, setSearchParams] = useSearchParams();
  const date = searchParams.get('date') || formatDate(dateToday());

  const [calOpen, setCalOpen] = useState(false);
  const log = state.dailyLogs[date];

  const markedDates = useMemo(() => {
    const set = new Set();
    for (const d in state.dailyLogs) {
      if (logHasData(state.dailyLogs[d])) set.add(d);
    }
    return set;
  }, [state.dailyLogs]);

  function selectDate(next) {
    setSearchParams({ date: next });
    setCalOpen(false);
  }

  const tasks = log?.tasks ?? [];
  const sleep = log?.sleep ?? '';
  const rating = log?.rating ?? null;
  const reflection = log?.reflection ?? '';

  return (
    <section className="today">
      <div className="today__main">
        <header className="today__header">
          <h2 className="today__date">{prettyDate(date)}</h2>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => setCalOpen(true)}
          >
            Calendar
          </button>
        </header>

        <section className="today__section">
          <h3 className="today__section-title">Tasks</h3>
          {tasks.length === 0 ? (
            <p className="muted">No tasks logged for this day yet.</p>
          ) : (
            <div className="task-list">
              {tasks.map((t) => (
                <TaskRow key={t.id} date={date} task={t} goals={state.goals} />
              ))}
            </div>
          )}
          <AddTaskForm date={date} goals={state.goals} />
        </section>

        <section className="today__section">
          <h3 className="today__section-title">Sleep</h3>
          <div className="today__inline">
            <input
              className="input input--narrow"
              type="number"
              min="0"
              max="24"
              step="0.25"
              value={sleep}
              onChange={(e) => {
                const v = e.target.value;
                dispatch({
                  type: 'SET_SLEEP',
                  payload: { date, sleep: v === '' ? null : Number(v) },
                });
              }}
              placeholder="0"
            />
            <span className="muted">hours</span>
          </div>
        </section>

        <section className="today__section">
          <h3 className="today__section-title">Daily Rating</h3>
          <div className="rating">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                className={
                  'rating__btn' + (rating === n ? ' rating__btn--active' : '')
                }
                onClick={() =>
                  dispatch({
                    type: 'SET_RATING',
                    payload: { date, rating: rating === n ? null : n },
                  })
                }
              >
                {n}
              </button>
            ))}
          </div>
        </section>

        <section className="today__section">
          <h3 className="today__section-title">Reflection</h3>
          <ReflectionField
            key={date}
            value={reflection}
            onSave={(v) =>
              dispatch({ type: 'SET_REFLECTION', payload: { date, reflection: v } })
            }
          />
        </section>
      </div>

      <Notes />

      <Modal open={calOpen} onClose={() => setCalOpen(false)} title="Pick a date">
        <Calendar
          selectedDate={date}
          markedDates={markedDates}
          onSelect={selectDate}
        />
      </Modal>
    </section>
  );
}

function ReflectionField({ value, onSave }) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  return (
    <textarea
      className="input textarea"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        if (draft !== value) onSave(draft);
      }}
      rows={5}
      placeholder="How did the day go?"
    />
  );
}
