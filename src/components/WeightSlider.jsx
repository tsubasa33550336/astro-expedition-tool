import { C } from "../theme";

export default function WeightSlider({ label, icon: Icon, value, onChange }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Icon size={13} className="text-ink-muted" />
      <span className="text-xs w-16 text-ink-muted">{label}</span>
      <input
        type="range"
        min="0"
        max="40"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1"
        style={{ accentColor: C.gold }}
      />
      <span className="text-xs w-6 text-right font-mono">{value}</span>
    </div>
  );
}
