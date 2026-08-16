import { useState, useMemo } from "react";
import {
  MapPin, Cloud, Wind, Droplets, Moon, Car, Thermometer,
  ParkingCircle, ShieldAlert, Store, ChevronRight, SlidersHorizontal,
} from "lucide-react";

import CANDIDATES from "./data/candidates.json";
import EQUIPMENT from "./data/equipment.json";
import CARS from "./data/cars.json";

import { avgCloud, maxWind, totalScore } from "./lib/scoring";
import { C, scoreColor, scoreLabel } from "./theme";

import Badge from "./components/Badge";
import WeightSlider from "./components/WeightSlider";
import ScoreRadar from "./components/ScoreRadar";
import WeatherChart from "./components/WeatherChart";

export default function App() {
  const [filters, setFilters] = useState({ maxDrive: 200, maxBortle: 9, needToilet: false, needCurbside: false });
  const [weights, setWeights] = useState({ sky: 25, cloud: 25, wind: 15, moon: 15, dist: 20 });
  const [selected, setSelected] = useState(CANDIDATES[0].id);
  const [tab, setTab] = useState("overview");

  const filtered = useMemo(() => {
    return CANDIDATES.filter((c) =>
      c.driveMin <= filters.maxDrive &&
      c.bortle <= filters.maxBortle &&
      (!filters.needToilet || c.toilet.has) &&
      (!filters.needCurbside || c.parking.includes("横付け") || c.parking.includes("駐車場"))
    );
  }, [filters]);

  const ranked = useMemo(
    () => [...filtered].map((c) => ({ ...c, score: totalScore(c, weights) })).sort((a, b) => b.score - a.score),
    [filtered, weights]
  );

  const cand = CANDIDATES.find((c) => c.id === selected) || ranked[0];

  return (
    <div className="min-h-screen bg-night-bg text-ink font-body p-5">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-xs tracking-widest mb-1 font-mono text-gold-dim">
            EXPEDITION PLANNER — 天文サークル遠征支援
          </div>
          <h1 className="text-2xl font-bold font-display">遠征先選定ダッシュボード</h1>
        </div>
        <div className="flex gap-1 rounded-lg p-1 bg-night-panel border border-night-border">
          {[["overview", "比較・検索"], ["logistics", "配車"]].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === k ? "bg-gold text-night-bg" : "text-ink-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* フィルターバー */}
      <div className="flex flex-wrap items-center gap-4 mb-4 p-3 rounded-lg bg-night-panel border border-night-border">
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-muted">所要時間 ≤</span>
          <input type="range" min="20" max="200" value={filters.maxDrive}
            onChange={(e) => setFilters((f) => ({ ...f, maxDrive: Number(e.target.value) }))}
            style={{ accentColor: C.gold }} />
          <span className="text-xs w-14 font-mono">{filters.maxDrive}分</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-muted">空の暗さ Bortle ≤</span>
          <input type="range" min="1" max="9" value={filters.maxBortle}
            onChange={(e) => setFilters((f) => ({ ...f, maxBortle: Number(e.target.value) }))}
            style={{ accentColor: C.gold }} />
          <span className="text-xs w-6 font-mono">{filters.maxBortle}</span>
        </div>
        <label className="flex items-center gap-1.5 text-xs cursor-pointer text-ink-muted">
          <input type="checkbox" checked={filters.needToilet}
            onChange={(e) => setFilters((f) => ({ ...f, needToilet: e.target.checked }))} />
          トイレ必須
        </label>
        <label className="flex items-center gap-1.5 text-xs cursor-pointer text-ink-muted">
          <input type="checkbox" checked={filters.needCurbside}
            onChange={(e) => setFilters((f) => ({ ...f, needCurbside: e.target.checked }))} />
          駐車場あり
        </label>
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-12 gap-4">
          {/* 比較テーブル */}
          <div className="col-span-7 rounded-lg overflow-hidden bg-night-panel border border-night-border">
            <div className="px-4 py-2.5 text-xs font-medium tracking-wide border-b border-night-border text-ink-muted">
              候補地比較（本日想定・{ranked.length}件）
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-ink-muted">
                  <th className="text-left px-4 py-2 font-normal">候補地</th>
                  <th className="text-left px-2 py-2 font-normal">Bortle</th>
                  <th className="text-left px-2 py-2 font-normal">雲量目安</th>
                  <th className="text-left px-2 py-2 font-normal">移動</th>
                  <th className="text-left px-2 py-2 font-normal">暗黒時間</th>
                  <th className="text-left px-4 py-2 font-normal">遠征指数</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(c.id)}
                    className="cursor-pointer transition-colors border-t border-night-border"
                    style={{ background: selected === c.id ? C.panelAlt : "transparent" }}
                  >
                    <td className="px-4 py-2.5">
                      <div className="font-medium flex items-center gap-1.5">
                        <MapPin size={12} style={{ color: C.gold }} />
                        {c.name}
                      </div>
                      <div className="text-xs text-ink-muted">{c.pref}</div>
                    </td>
                    <td className="px-2 py-2.5">
                      <span
                        className="inline-block w-6 h-4 rounded text-center text-[10px] leading-4 text-white"
                        style={{ background: C.bortle[c.bortle - 1] }}
                      >
                        {c.bortle}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 font-mono">{Math.round(avgCloud(c.hourly))}%</td>
                    <td className="px-2 py-2.5 font-mono">{c.driveMin}分</td>
                    <td className="px-2 py-2.5 font-mono">{c.moon.darkHours}h</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-night-border">
                          <div className="h-1.5 rounded-full" style={{ width: `${c.score}%`, background: scoreColor(c.score) }} />
                        </div>
                        <span className="text-xs font-semibold font-mono" style={{ color: scoreColor(c.score) }}>
                          {c.score}
                        </span>
                        <ChevronRight size={12} className="text-ink-muted" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 重み設定 */}
          <div className="col-span-5 rounded-lg p-4 bg-night-panel border border-night-border">
            <div className="flex items-center gap-1.5 text-xs font-medium mb-3 text-ink-muted">
              <SlidersHorizontal size={13} /> 遠征指数の重み付け
            </div>
            <WeightSlider label="空の暗さ" icon={Moon} value={weights.sky} onChange={(v) => setWeights((w) => ({ ...w, sky: v }))} />
            <WeightSlider label="雲量" icon={Cloud} value={weights.cloud} onChange={(v) => setWeights((w) => ({ ...w, cloud: v }))} />
            <WeightSlider label="風速" icon={Wind} value={weights.wind} onChange={(v) => setWeights((w) => ({ ...w, wind: v }))} />
            <WeightSlider label="月明かり" icon={Moon} value={weights.moon} onChange={(v) => setWeights((w) => ({ ...w, moon: v }))} />
            <WeightSlider label="移動距離" icon={Car} value={weights.dist} onChange={(v) => setWeights((w) => ({ ...w, dist: v }))} />
          </div>

          {/* 候補地詳細 */}
          {cand && (
            <div className="col-span-12 rounded-lg p-4 bg-night-panel border border-night-border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2 font-display">
                    {cand.name}
                    <Badge color={scoreColor(totalScore(cand, weights))}>
                      {scoreLabel(totalScore(cand, weights))} ・ {totalScore(cand, weights)}点
                    </Badge>
                  </h2>
                  <div className="text-xs mt-0.5 font-mono text-ink-muted">
                    {cand.lat}, {cand.lng} ・ 標高{cand.elev}m ・ SQM {cand.sqm}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4">
                  <div className="text-xs font-medium mb-2 text-ink-muted">夜間の雲量推移</div>
                  <WeatherChart hourly={cand.hourly} />
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div className="flex items-center gap-1"><Wind size={12} className="text-ink-muted" />最大風速 {maxWind(cand.hourly)}m/s</div>
                    <div className="flex items-center gap-1"><Droplets size={12} className="text-ink-muted" />湿度 {cand.hourly[3].humidity}%</div>
                    <div className="flex items-center gap-1"><Thermometer size={12} className="text-ink-muted" />露点 {cand.hourly[3].dew}℃</div>
                    <div className="flex items-center gap-1"><Moon size={12} className="text-ink-muted" />月齢 {cand.moon.age}</div>
                  </div>
                </div>

                <div className="col-span-4">
                  <div className="text-xs font-medium mb-2 text-ink-muted">遠征指数の内訳</div>
                  <ScoreRadar cand={cand} weights={weights} />
                </div>

                <div className="col-span-4 text-xs space-y-2 text-ink-muted">
                  <div className="text-xs font-medium mb-1 text-ink">現地情報</div>
                  <div className="flex gap-2"><ParkingCircle size={13} className="mt-0.5 shrink-0" />{cand.ground} ／ {cand.parking}</div>
                  <div className="flex gap-2"><ShieldAlert size={13} className="mt-0.5 shrink-0" />{cand.restriction}</div>
                  <div className="flex gap-2"><Store size={13} className="mt-0.5 shrink-0" />
                    コンビニ{cand.nearby.conbini} ／ 温泉{cand.nearby.onsen} ／ GS{cand.nearby.gas}
                  </div>
                  <div className="pt-1 border-t border-night-border">
                    過去実績: {cand.pastVisits.length === 0 ? "なし(初遠征候補)" :
                      cand.pastVisits.map((v) => `${v.date}(${v.count}名)`).join(" / ")}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "logistics" && cand && (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6 rounded-lg p-4 bg-night-panel border border-night-border">
            <div className="text-xs font-medium mb-3 text-ink-muted">移動・費用概算（{cand.name}）</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><div className="text-xs text-ink-muted">距離</div><div className="font-mono">{cand.driveKm} km</div></div>
              <div><div className="text-xs text-ink-muted">所要時間</div><div className="font-mono">{cand.driveMin} 分</div></div>
              <div><div className="text-xs text-ink-muted">高速料金(概算)</div><div className="font-mono">¥{cand.toll.toLocaleString()}</div></div>
              <div><div className="text-xs text-ink-muted">ガソリン(概算)</div><div className="font-mono">{cand.gasL} L</div></div>
            </div>
            <div className="mt-3 pt-3 text-sm border-t border-night-border">
              <div className="text-xs mb-1 text-ink-muted">
                割り勘目安（参加{Math.max(1, ...cand.pastVisits.map((v) => v.count), CARS.reduce((a, c) => a + c.capacity, 0))}名想定）
              </div>
              <div className="font-mono" style={{ color: C.gold }}>
                一人あたり ¥{Math.round((cand.toll + cand.gasL * 175) / CARS.reduce((a, c) => a + c.capacity, 0)).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="col-span-6 rounded-lg p-4 bg-night-panel border border-night-border">
            <div className="text-xs font-medium mb-3 text-ink-muted">配車・積載シミュレーション</div>
            {CARS.map((car, i) => (
              <div key={i} className={`mb-3 pb-3 ${i < CARS.length - 1 ? "border-b border-night-border" : ""}`}>
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <Car size={13} style={{ color: C.gold }} /> {car.driver}
                </div>
                <div className="text-xs mt-1 text-ink-muted">
                  乗車定員 {car.capacity}名 ／ 積載枠 {car.cargo}
                </div>
              </div>
            ))}
            <div className="text-xs font-medium mt-2 mb-2 text-ink">機材積載チェック</div>
            <div className="space-y-1.5">
              {EQUIPMENT.map((eq, i) => {
                const totalCargo = CARS.reduce((a, c) => a + c.cargo, 0);
                const usedBefore = EQUIPMENT.slice(0, i).reduce((a, e) => a + e.size, 0);
                const fits = usedBefore + eq.size <= totalCargo;
                return (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span>{eq.name}</span>
                    <Badge color={fits ? C.ok : C.danger}>{fits ? "積載OK" : "容量超過注意"}</Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-center text-ink-muted">
        ※ 表示データはすべてダミーです（src/data/*.json）。実際の気象・月齢はAPI連携後に反映されます。
      </div>
    </div>
  );
}
