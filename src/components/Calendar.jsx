import { useState } from 'react';
import { formatDate, today } from '../lib/dates.js';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export default function Calendar({ selectedDate, markedDates, onSelect }) {
  const initial = selectedDate ? parseDate(selectedDate) : today();
  const [view, setView] = useState({
    year: initial.getFullYear(),
    month: initial.getMonth(),
  });

  const firstDay = new Date(view.year, view.month, 1);
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const startOffset = firstDay.getDay();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthLabel = firstDay.toLocaleString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  function prevMonth() {
    setView((v) => {
      const m = v.month - 1;
      return m < 0
        ? { year: v.year - 1, month: 11 }
        : { year: v.year, month: m };
    });
  }

  function nextMonth() {
    setView((v) => {
      const m = v.month + 1;
      return m > 11
        ? { year: v.year + 1, month: 0 }
        : { year: v.year, month: m };
    });
  }

  function jumpToToday() {
    const t = today();
    setView({ year: t.getFullYear(), month: t.getMonth() });
    onSelect(formatDate(t));
  }

  const todayStr = formatDate(today());

  return (
    <div className="calendar">
      <header className="calendar__header">
        <button type="button" className="icon-btn" onClick={prevMonth} aria-label="Previous month">
          ‹
        </button>
        <div className="calendar__title">{monthLabel}</div>
        <button type="button" className="icon-btn" onClick={nextMonth} aria-label="Next month">
          ›
        </button>
      </header>

      <div className="calendar__weekdays">
        {WEEKDAYS.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      <div className="calendar__grid">
        {cells.map((d, i) => {
          if (d == null) return <span key={i} className="calendar__cell" />;
          const dateStr = `${view.year}-${String(view.month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === todayStr;
          const marked = markedDates.has(dateStr);
          return (
            <button
              key={i}
              type="button"
              className={
                'calendar__cell calendar__cell--day' +
                (isSelected ? ' calendar__cell--selected' : '') +
                (isToday ? ' calendar__cell--today' : '')
              }
              onClick={() => onSelect(dateStr)}
            >
              <span>{d}</span>
              {marked && <span className="calendar__dot" />}
            </button>
          );
        })}
      </div>

      <div className="calendar__footer">
        <button type="button" className="btn btn--ghost btn--sm" onClick={jumpToToday}>
          Today
        </button>
      </div>
    </div>
  );
}
