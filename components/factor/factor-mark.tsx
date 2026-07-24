// The Factor emblem, traced 1:1 from the in-app brand reference: a head disc
// over two bars with 45° cuts, the lower bar merging into a stem, on the sky
// gradient plate. Kept inline so the mark never flashes on slow networks.
export default function FactorMark({
  size = 56,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="factorPlateLp" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0ea5e9" />
          <stop offset="1" stopColor="#0369a1" />
        </linearGradient>
      </defs>
      <circle cx="256" cy="256" r="256" fill="url(#factorPlateLp)" />
      <g transform="translate(12.8 12.8) scale(0.95)">
        <circle cx="256" cy="103" r="38.25" fill="#fff" />
        <polygon
          points="150.25,172.75 361.75,172.75 361.75,202 323.5,240.25 150.25,240.25"
          fill="#fff"
        />
        <polygon
          points="150.25,271.75 361.75,271.75 361.75,301 323.5,339.25 214.75,339.25 214.75,447.25 172,447.25 150.25,425.5"
          fill="#fff"
        />
      </g>
    </svg>
  );
}
