export default function ScanCorners({ color = '#B1A03E', className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      <span className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 rounded-tl-sm" style={{ borderColor: color }} />
      <span className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 rounded-tr-sm" style={{ borderColor: color }} />
      <span className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 rounded-bl-sm" style={{ borderColor: color }} />
      <span className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 rounded-br-sm" style={{ borderColor: color }} />
    </div>
  );
}