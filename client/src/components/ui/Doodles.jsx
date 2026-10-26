export function Sparkle({ className = '', fill = 'currentColor' }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className} fill={fill}>
      <path d="M20 0c1.2 11 7.8 18 20 20-12.2 2-18.8 9-20 20-1.2-11-7.8-18-20-20C12.2 18 18.8 11 20 0Z" />
    </svg>
  );
}

export function Asterisk({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className} fill="currentColor">
      <path d="M32 2c1.4 13.6 8.3 22 22 24-13.7 2-20.6 10.4-22 24-1.4-13.6-8.3-22-22-24 13.7-2 20.6-10.4 22-24Z" />
      <path d="M53 6c.7 6.9 4.2 11.1 11 12.1-6.8 1-10.3 5.2-11 12.1-.7-6.9-4.2-11.1-11-12.1 6.8-1 10.3-5.2 11-12.1Z" opacity=".55" />
    </svg>
  );
}

export function Smiley({ className = '', dark = true }) {
  const face = dark ? '#191a23' : '#b9ff66';
  const features = dark ? '#b9ff66' : '#191a23';
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <circle cx="50" cy="50" r="48" fill={face} />
      <circle cx="35" cy="40" r="6" fill={features} />
      <circle cx="65" cy="40" r="6" fill={features} />
      <path d="M30 60c5 10 14 15 20 15s15-5 20-15" fill="none" stroke={features} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export function Ring({ className = '' }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className} fill="none" stroke="currentColor">
      <circle cx="60" cy="60" r="57" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="44" strokeWidth="1" strokeDasharray="3 6" />
      <circle cx="60" cy="3" r="5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Scribble({ className = '' }) {
  return (
    <svg viewBox="0 0 180 60" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 42c22-30 48-38 62-22s-9 31 8 32 24-28 44-30 31 18 58 12" />
    </svg>
  );
}

export function ArrowDoodle({ className = '' }) {
  return (
    <svg viewBox="0 0 120 80" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 12c22 44 62 54 104 42" />
      <path d="M92 42l18 12-21 8" />
    </svg>
  );
}

export function GridDots({ className = '' }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className} fill="currentColor">
      {Array.from({ length: 25 }).map((_, index) => (
        <circle
          key={index}
          cx={10 + (index % 5) * 20}
          cy={10 + Math.floor(index / 5) * 20}
          r="1.8"
          opacity="0.45"
        />
      ))}
    </svg>
  );
}
