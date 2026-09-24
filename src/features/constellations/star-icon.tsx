export function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16 2 19.5 12.5 30 16 19.5 19.5 16 30 12.5 19.5 2 16 12.5 12.5Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <path d="m16 8 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="currentColor" />
    </svg>
  );
}
