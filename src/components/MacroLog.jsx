import { useEffect, useState } from 'react';
import { useAppState } from '../hooks/useAppState.jsx';
import { formatDate, today as dateToday } from '../lib/dates.js';

const empty = { calories: '', protein: '', carbs: '', fat: '' };

export default function MacroLog() {
  const { state, dispatch } = useAppState();
  const [date, setDate] = useState(formatDate(dateToday()));
  const [form, setForm] = useState(empty);

  useEffect(() => {
    const existing = state.fitness?.dailyLogs.find((l) => l.date === date);
    if (existing) {
      setForm({
        calories: existing.calories,
        protein: existing.protein,
        carbs: existing.carbs,
        fat: existing.fat,
      });
    } else {
      setForm(empty);
    }
  }, [date, state.fitness?.dailyLogs]);

  function submit(e) {
    e.preventDefault();
    dispatch({
      type: 'LOG_MACROS',
      payload: {
        date,
        calories: Number(form.calories) || 0,
        protein: Number(form.protein) || 0,
        carbs: Number(form.carbs) || 0,
        fat: Number(form.fat) || 0,
      },
    });
  }

  return (
    <form className="inline-form macro-form" onSubmit={submit}>
      <input
        className="input"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        className="input input--narrow"
        type="number"
        min="0"
        placeholder="cal"
        value={form.calories}
        onChange={(e) => setForm({ ...form, calories: e.target.value })}
      />
      <input
        className="input input--narrow"
        type="number"
        min="0"
        placeholder="P (g)"
        value={form.protein}
        onChange={(e) => setForm({ ...form, protein: e.target.value })}
      />
      <input
        className="input input--narrow"
        type="number"
        min="0"
        placeholder="C (g)"
        value={form.carbs}
        onChange={(e) => setForm({ ...form, carbs: e.target.value })}
      />
      <input
        className="input input--narrow"
        type="number"
        min="0"
        placeholder="F (g)"
        value={form.fat}
        onChange={(e) => setForm({ ...form, fat: e.target.value })}
      />
      <button type="submit" className="btn btn--primary btn--sm">
        Log
      </button>
    </form>
  );
}
