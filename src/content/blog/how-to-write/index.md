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

記事と同じフォルダに画像を置いて、相対パスで書きます。

```md
![池の写真](./pond.jpg)
```

- 書いている間は、手元の画像がそのまま表示されます（git には入りません）。
- 公開する前に `npm run images` を実行します。画像の向きを補正し、位置情報などの EXIF を消して、AVIF と WebP の 480 / 960 / 1600px に変換してから Cloudflare R2（`img.tanakee.com`）にアップロードします。
- 実行すると `src/data/images.json` が更新されます。記事と一緒にこのファイルもコミットしてください。サイトのビルドはこのファイルを見て、画像を R2 から表示します。
- `npm run dev` を起動中だった場合は、再起動すると R2 の画像に切り替わります。

## コード

コードブロックはビルド時に色付けされます。

```js
const frog = { name: 'tanakee', jumps: true }
```
