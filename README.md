# Tanakee's Portfolio

カエルと小さな池をテーマにしたインタラクティブなポートフォリオサイト。Astro（静的出力）+ Tailwind CSS v4 で構成し、カエルと池は React Three Fiber のアイランドとして動かしています。

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
