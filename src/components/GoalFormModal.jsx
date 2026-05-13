import { useEffect, useState } from 'react';
import Modal from './Modal.jsx';

const empty = {
  name: '',
  totalHoursEstimate: '',
  weeklyTargetHours: '',
  deadline: '',
};

export default function GoalFormModal({ open, initialGoal, onSubmit, onClose }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (!open) return;
    if (initialGoal) {
      setForm({
        name: initialGoal.name ?? '',
        totalHoursEstimate: initialGoal.totalHoursEstimate ?? '',
        weeklyTargetHours: initialGoal.weeklyTargetHours ?? '',
        deadline: initialGoal.deadline ?? '',
      });
    } else {
      setForm(empty);
    }
  }, [open, initialGoal]);

  function handleSubmit(e) {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return;
    onSubmit({
      name,
      totalHoursEstimate: Number(form.totalHoursEstimate) || 0,
      weeklyTargetHours: Number(form.weeklyTargetHours) || 0,
      deadline: form.deadline || null,
    });
  }

  return (
    <Modal open={open} onClose={onClose} title={initialGoal ? 'Edit goal' : 'New goal'}>
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field__label">Name</span>
          <input
            className="input"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            autoFocus
            required
          />
        </label>
        <label className="field">
          <span className="field__label">Total hours estimate</span>
          <input
            className="input"
            type="number"
            min="0"
            step="0.5"
            value={form.totalHoursEstimate}
            onChange={(e) =>
              setForm({ ...form, totalHoursEstimate: e.target.value })
            }
          />
        </label>
        <label className="field">
          <span className="field__label">Weekly target hours</span>
          <input
            className="input"
            type="number"
            min="0"
            step="0.5"
            value={form.weeklyTargetHours}
            onChange={(e) =>
              setForm({ ...form, weeklyTargetHours: e.target.value })
            }
          />
        </label>
        <label className="field">
          <span className="field__label">Deadline</span>
          <input
            className="input"
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />
        </label>
        <div className="form__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            {initialGoal ? 'Save' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
