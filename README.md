# Tanakee's Portfolio

雨の降る蓮池をテーマにしたインタラクティブなポートフォリオサイト。React + Three.js（水面シェーダー）+ SVG/Framer Motionのカエル・蓮の葉で構成しています。

## 開発

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
npm run preview
```

## デプロイ

`main` ブランチへの push で GitHub Actions (`.github/workflows/deploy.yml`) が自動的にビルドし、GitHub Pages に公開します。
リポジトリの Settings > Pages > Source を「GitHub Actions」に設定してください。
