export default function Badge({ children, color }) {
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: color + "22", color, border: `1px solid ${color}55` }}
    >
      {children}
    </span>
  );
}
