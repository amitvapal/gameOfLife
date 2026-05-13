function clamp01(n) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

export default function RingChart({
  progress,
  label,
  sublabel,
  size = 140,
  strokeWidth = 12,
  onClick,
}) {
  const p = clamp01(progress);
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - p);
  const pct = Math.round(p * 100);
  const cx = size / 2;
  const cy = size / 2;

  const ring = (
    <span className="ring">
      <svg
        className="ring__svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${label}: ${pct} percent`}
      >
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        <circle
          className="ring__progress"
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontStyle="italic"
          fontSize={size * 0.22}
          fill="var(--text)"
        >
          {pct}%
        </text>
      </svg>
      <span className="ring__label">{label}</span>
      {sublabel && <span className="ring__sublabel">{sublabel}</span>}
    </span>
  );

  if (onClick) {
    return (
      <button type="button" className="ring-button" onClick={onClick}>
        {ring}
      </button>
    );
  }
  return ring;
}
