# 遠征先選定ダッシュボード（プロトタイプ）

天文サークルの遠征先・日程選定を支援するダッシュボード。Vite + React + Tailwind CSS + recharts。

## セットアップ

```bash
npm install
npm run dev
```

`http://localhost:5173` で確認できます。

## ディレクトリ構成

```
src/
  data/
    candidates.json   ← 候補地DB（名称・座標・光害レベル・設備・過去実績など）
    equipment.json     ← 機材リスト（配車シミュレーション用）
    cars.json           ← 車両リスト（定員・積載枠）
  lib/
    scoring.js          ← GO/NO-GOスコア（遠征指数）の計算ロジック
  components/
    Badge.jsx
    WeightSlider.jsx
    ScoreRadar.jsx
    WeatherChart.jsx
  theme.js              ← カラートークン（tailwind.config.js と値を揃えて管理）
  App.jsx                ← 画面全体の組み立て
```

コード（ロジック・見た目）とデータを分離してあるので、**候補地を増やす/内容を直すだけなら
`src/data/*.json` を編集するだけで済み**、`App.jsx` 側は触らなくて大丈夫です。

## 候補地を追加・編集する

`src/data/candidates.json` に同じ形のオブジェクトを追加してください。`hourly` は当日夜間の
時間帯別の予報値（今はダミー値）、`moon` は月齢・月の出没・暗黒時間です。

## 今後、実データに繋ぐ場合の方針

現状はすべてビルド時に読み込む静的JSONです。実際の気象・地図APIと連携する場合は、
以下のように段階的に置き換えるのがおすすめです。

1. **気象・月齢データ**（機能要件2）
   - `src/data/candidates.json` の `hourly` / `moon` を、候補地ごとに
     Open-Meteo などの気象APIから取得した値で上書きする `fetchWeather(lat, lng)` 関数を
     `src/lib/weatherApi.js` として新設し、`App.jsx` で `useEffect` 内から呼び出す。
   - 月齢計算は `astronomy-engine` などのライブラリを追加すると自前実装が不要。
   - APIキーが必要なサービスは `.env`（`VITE_WEATHER_API_KEY=...` の形）に置き、
     コードからは `import.meta.env.VITE_WEATHER_API_KEY` で参照する。`.env` は
     `.gitignore` 済みなので、キーがリポジトリに入る心配はありません。

2. **ロジスティクス・配車**（機能要件4）
   - 移動時間・距離・料金は Google Maps Directions API / Google Maps Platform の
     Routes API に置き換え、`src/lib/routing.js` にまとめる。

3. **候補地DBの更新・共同編集**（機能要件1）
   - 部員間で候補地情報を更新したい場合、JSONファイルの直接編集はGit操作が必要になり
     ハードルが上がるので、将来的には Supabase や Google スプレッドシート＋API 経由での
     読み書きに載せ替えると運用しやすくなります。

## ビルド・公開

```bash
npm run build
```

`dist/` に静的ファイルが出力されるので、Vercel / Netlify / GitHub Pages などにそのまま
デプロイできます。

## GitHub Pagesで公開する場合

このリポジトリには `.github/workflows/deploy.yml` を用意してあります。`main` ブランチに
pushするたびに、自動でビルドしてGitHub Pagesへデプロイされます。

1. GitHubリポジトリの **Settings > Pages** を開く
2. **Source** を「GitHub Actions」に変更する（「Deploy from a branch」ではない点に注意）
3. `main` ブランチにpushする（このREADMEやvite.config.jsの変更もpushでOK）
4. リポジトリの **Actions** タブでワークフローの実行状況を確認できる。緑のチェックが付けば
   `https://<ユーザー名>.github.io/astro-expedition-tool/` で公開される

デフォルトブランチが `main` ではなく `master` などの場合は、
`.github/workflows/deploy.yml` の `branches: ["main"]` を実際のブランチ名に合わせて
書き換えてください。

`vite.config.js` の `base: "/astro-expedition-tool/"` はリポジトリ名に合わせた設定です。
リポジトリ名を変える場合はここも同じ値に揃える必要があります。
