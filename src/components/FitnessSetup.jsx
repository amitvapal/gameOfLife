import { useState } from 'react';
import { useAppState } from '../hooks/useAppState.jsx';
import { formatDate, today as dateToday } from '../lib/dates.js';

export default function FitnessSetup() {
  const { dispatch } = useAppState();
  const [form, setForm] = useState({
    startWeight: '',
    goalWeight: '',
    targetDate: '',
    dailyCalorieTarget: '',
  });

  function submit(e) {
    e.preventDefault();
    dispatch({
      type: 'INIT_FITNESS',
      payload: {
        startWeight: Number(form.startWeight) || 0,
        goalWeight: Number(form.goalWeight) || 0,
        startDate: formatDate(dateToday()),
        targetDate: form.targetDate || null,
        dailyCalorieTarget: Number(form.dailyCalorieTarget) || 0,
      },
    });
  }

  return (
    <div className="fitness-setup">
      <h3 className="fitness-setup__title">Set up your fitness goals</h3>
      <p className="muted">
        Tell us where you're starting from and where you want to land.
      </p>
      <form className="form" onSubmit={submit}>
        <div className="form__row">
          <label className="field">
            <span className="field__label">Starting weight (lbs)</span>
            <input
              className="input"
              type="number"
              min="0"
              step="0.1"
              required
              value={form.startWeight}
              onChange={(e) => setForm({ ...form, startWeight: e.target.value })}
            />
          </label>
          <label className="field">
            <span className="field__label">Goal weight (lbs)</span>
            <input
              className="input"
              type="number"
              min="0"
              step="0.1"
              required
              value={form.goalWeight}
              onChange={(e) => setForm({ ...form, goalWeight: e.target.value })}
            />
          </label>
        </div>
        <div className="form__row">
          <label className="field">
            <span className="field__label">Target date (optional)</span>
            <input
              className="input"
              type="date"
              value={form.targetDate}
              onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
            />
          </label>
          <label className="field">
            <span className="field__label">Maintenance calories</span>
            <input
              className="input"
              type="number"
              min="0"
              step="10"
              required
              value={form.dailyCalorieTarget}
              onChange={(e) =>
                setForm({ ...form, dailyCalorieTarget: e.target.value })
              }
            />
          </label>
        </div>
        <div className="form__actions">
          <button type="submit" className="btn btn--primary">
            Start tracking
          </button>
        </div>
      </form>
    </div>
  );
}
