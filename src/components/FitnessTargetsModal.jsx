import { useEffect, useState } from 'react';
import { useAppState } from '../hooks/useAppState.jsx';
import Modal from './Modal.jsx';

export default function FitnessTargetsModal({ open, onClose }) {
  const { state, dispatch } = useAppState();
  const fitness = state.fitness;
  const [form, setForm] = useState({
    goalWeight: '',
    targetDate: '',
    dailyCalorieTarget: '',
  });

  useEffect(() => {
    if (open && fitness) {
      setForm({
        goalWeight: fitness.goalWeight,
        targetDate: fitness.targetDate ?? '',
        dailyCalorieTarget: fitness.dailyCalorieTarget,
      });
    }
  }, [open, fitness]);

  function submit(e) {
    e.preventDefault();
    dispatch({
      type: 'UPDATE_FITNESS_TARGETS',
      payload: {
        goalWeight: Number(form.goalWeight) || 0,
        targetDate: form.targetDate || null,
        dailyCalorieTarget: Number(form.dailyCalorieTarget) || 0,
      },
    });
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit targets">
      <form className="form" onSubmit={submit}>
        <label className="field">
          <span className="field__label">Goal weight (lbs)</span>
          <input
            className="input"
            type="number"
            min="0"
            step="0.1"
            value={form.goalWeight}
            onChange={(e) => setForm({ ...form, goalWeight: e.target.value })}
          />
        </label>
        <label className="field">
          <span className="field__label">Target date</span>
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
            value={form.dailyCalorieTarget}
            onChange={(e) =>
              setForm({ ...form, dailyCalorieTarget: e.target.value })
            }
          />
        </label>
        <div className="form__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
