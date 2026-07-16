// The same arrow silhouette drawn by the home globe's cursor-texture, as an SVG.
export default function CursorIcon({ color, className }: { color: string; className?: string }) {
  return (
    <svg viewBox="-1 -1 16 28" className={className} aria-hidden="true">
      <path
        d="M0 0 L0 22 L4.5 17.5 L8 26 L11.5 24.5 L8 16 L14 16 Z"
        fill={color}
        stroke={color}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
