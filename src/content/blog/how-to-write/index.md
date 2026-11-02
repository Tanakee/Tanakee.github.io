---
title: 記事の書き方
description: このブログに記事を追加するときのテンプレート。draft なので本番には出ません。
date: 2026-11-02
tags: [meta]
draft: true
---

このファイルは書き方のメモです。`draft: true` の記事は `npm run dev` でだけ表示され、本番のビルドには含まれません。

## 記事を追加する

`src/content/blog/<スラッグ>/index.md` を作ります。フォルダ名がそのまま URL（`/blog/<スラッグ>/`）になります。

```yaml
---
title: 記事タイトル
description: 一覧や OGP に出る短い説明
date: 2026-11-02
tags: [three.js, react]
cover: ./cover.jpg   # 任意。記事と同じフォルダに置く
draft: true          # 公開するときに消すか false にする
---
```

## 画像

記事と同じフォルダに画像を置いて、相対パスで書きます。ビルド時に WebP への変換とサイズ調整が自動で行われます。

```md
![池の写真](./pond.jpg)
```

## コード

コードブロックはビルド時に色付けされます。

```js
const frog = { name: 'tanakee', jumps: true }
```
