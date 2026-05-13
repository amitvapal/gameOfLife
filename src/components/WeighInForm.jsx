import { useState } from 'react';
import { useAppState } from '../hooks/useAppState.jsx';
import { formatDate, today as dateToday } from '../lib/dates.js';

export default function WeighInForm() {
  const { dispatch } = useAppState();
  const [date, setDate] = useState(formatDate(dateToday()));
  const [weight, setWeight] = useState('');

  function submit(e) {
    e.preventDefault();
    const w = Number(weight);
    if (!w || !date) return;
    dispatch({
      type: 'ADD_WEIGHIN',
      payload: { date, weight: w },
    });
    setWeight('');
  }

  return (
    <form className="inline-form" onSubmit={submit}>
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
        step="0.1"
        placeholder="lbs"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        required
      />
      <button type="submit" className="btn btn--primary btn--sm">
        Add
      </button>
    </form>
  );
}
