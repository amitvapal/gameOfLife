import { useEffect, useState } from 'react';
import Modal from './Modal.jsx';

const empty = { name: '', hoursEstimate: '' };

export default function SubgoalFormModal({
  open,
  initialSubgoal,
  onSubmit,
  onClose,
}) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (!open) return;
    if (initialSubgoal) {
      setForm({
        name: initialSubgoal.name ?? '',
        hoursEstimate: initialSubgoal.hoursEstimate ?? '',
      });
    } else {
      setForm(empty);
    }
  }, [open, initialSubgoal]);

  function handleSubmit(e) {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return;
    onSubmit({
      name,
      hoursEstimate: Number(form.hoursEstimate) || 0,
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialSubgoal ? 'Edit subgoal' : 'New subgoal'}
    >
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
          <span className="field__label">Hours estimate</span>
          <input
            className="input"
            type="number"
            min="0"
            step="0.5"
            value={form.hoursEstimate}
            onChange={(e) => setForm({ ...form, hoursEstimate: e.target.value })}
          />
        </label>
        <div className="form__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            {initialSubgoal ? 'Save' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
