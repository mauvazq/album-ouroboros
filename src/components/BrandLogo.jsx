export default function BrandLogo({ compact = false }) {
  return (
    <div className={`brand-logo ${compact ? 'compact' : ''}`}>
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <circle className="brand-ring-outer" cx="100" cy="100" r="70" />
        <circle className="brand-ring-middle" cx="100" cy="100" r="50" />
        <circle className="brand-ring-inner" cx="100" cy="100" r="32" />
        <line className="brand-connector" x1="132" y1="100" x2="150" y2="100" />
        <circle className="brand-dot" cx="160" cy="100" r="10" />
      </svg>
      <span>ouroboros</span>
    </div>
  );
}
