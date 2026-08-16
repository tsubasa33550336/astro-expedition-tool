import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer,
} from "recharts";
import { subScores } from "../lib/scoring";
import { C } from "../theme";

export default function ScoreRadar({ cand, weights }) {
  const s = subScores(cand);
  const data = [
    { axis: "暗さ", v: s.sky },
    { axis: "雲量", v: s.cloud },
    { axis: "風", v: s.wind },
    { axis: "月明", v: s.moon },
    { axis: "距離", v: s.dist },
  ];
  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadarChart data={data} outerRadius="75%">
        <PolarGrid stroke={C.border} />
        <PolarAngleAxis dataKey="axis" tick={{ fill: C.muted, fontSize: 11 }} />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Radar dataKey="v" stroke={C.gold} fill={C.gold} fillOpacity={0.35} strokeWidth={2} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
