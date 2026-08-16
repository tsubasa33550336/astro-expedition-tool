// 遠征指数(GO/NO-GOスコア)の計算ロジック。
// 将来ここを実際の気象API/月齢計算ライブラリの出力に差し替えます。

export function avgCloud(hourly) {
  const s = hourly.reduce(
    (a, h) => a + (h.cloudLow * 0.5 + h.cloudMid * 0.3 + h.cloudHigh * 0.2),
    0
  );
  return s / hourly.length;
}

export function maxWind(hourly) {
  return Math.max(...hourly.map((h) => h.wind));
}

// 候補地1件から5軸(0〜100点)の素点を算出
export function subScores(cand) {
  const sky = ((9 - cand.bortle) / 8) * 100;
  const cloud = Math.max(0, 100 - avgCloud(cand.hourly));
  const wind = Math.max(0, 100 - maxWind(cand.hourly) * 9);
  const moon = Math.min(100, (cand.moon.darkHours / 6) * 100);
  const dist = Math.max(0, 100 - (cand.driveMin / 180) * 100);
  return { sky, cloud, wind, moon, dist };
}

// 重み付けして総合スコア(0〜100)を算出
export function totalScore(cand, weights) {
  const s = subScores(cand);
  const wsum = weights.sky + weights.cloud + weights.wind + weights.moon + weights.dist;
  const raw =
    s.sky * weights.sky +
    s.cloud * weights.cloud +
    s.wind * weights.wind +
    s.moon * weights.moon +
    s.dist * weights.dist;
  return Math.round(raw / wsum);
}
