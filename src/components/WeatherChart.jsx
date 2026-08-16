import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { C } from "../theme";

export default function WeatherChart({ hourly }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={hourly} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.muted} stopOpacity={0.5} />
            <stop offset="100%" stopColor={C.muted} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={C.border} strokeDasharray="2 4" vertical={false} />
        <XAxis dataKey="t" tick={{ fill: C.muted, fontSize: 10 }} axisLine={{ stroke: C.border }} tickLine={false} />
        <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
        <Tooltip
          contentStyle={{ background: C.panelAlt, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: C.text }}
        />
        <Area type="monotone" dataKey="cloudMid" name="雲量(中層)%" stroke={C.muted} fill="url(#cloudGrad)" strokeWidth={1.5} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
