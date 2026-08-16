// Tailwind (tailwind.config.js) と同じ値を、Chart.js的なライブラリへ
// hexで直接渡す必要がある箇所(recharts等)のために保持しています。
// 色を変える場合は、まず tailwind.config.js の theme.extend.colors を、
// 次にこのファイルを同じ値に揃えてください。
export const C = {
  bg: "#0B0E1A",
  panel: "#121729",
  panelAlt: "#1A2238",
  border: "#28304A",
  text: "#E9E7DD",
  muted: "#8B93A8",
  gold: "#E8A33D",
  goldDim: "#8A6A38",
  danger: "#C1443C",
  ok: "#5B9279",
  bortle: [
    "#0A1128", "#12203D", "#1B3654", "#245066", "#3E6E63",
    "#6E8F4E", "#B08B2E", "#C97B2B", "#C1443C",
  ],
};

export function scoreColor(score) {
  if (score >= 70) return C.ok;
  if (score >= 45) return C.gold;
  return C.danger;
}

export function scoreLabel(score) {
  if (score >= 70) return "GO";
  if (score >= 45) return "条件付GO";
  return "NO-GO";
}
