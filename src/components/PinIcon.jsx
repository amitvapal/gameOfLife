export default function PinIcon({ filled = false, size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M9 3h6l-1 5 3 3-4 1v6l-1 2-1-2v-6l-4-1 3-3z" />
    </svg>
  );
}
