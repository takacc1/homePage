# My Portfolio

プロフィール、これまでの実績、好きなことをまとめた自己紹介サイトです。
自身で撮影した写真とともに、学業・技術・陸上競技の取り組みや日々の趣味を紹介しています。

**[公開サイトを見る](https://takacc1.vercel.app/)**

## サイトの内容

| セクション | 内容 |
| --- | --- |
| [Profile](https://takacc1.vercel.app/#profile) | 現在の所属と次の進路 |
| [Achievements](https://takacc1.vercel.app/achievements.html) | 学業成績、AI技術賞、陸上競技の記録、活動歴 |
| [Interests](https://takacc1.vercel.app/#interests) | 陸上競技、ロードバイク、自作PC、写真、音楽、カープ |

趣味のページでは、それぞれの経験や好きなものを写真付きで紹介しています。
写真ギャラリーでは、写真を選ぶと大きく表示できます。

## 使用技術

- **HTML / CSS / JavaScript**：ページ構成、レスポンシブ対応、アニメーション
- **Google Fonts**：Montserrat、Noto Sans JP
- **Vercel**：サイトの公開

フレームワークを使わず、静的なHTMLファイルを中心に構成しています。

## ローカルで見る

リポジトリを取得し、Pythonの簡易サーバーで開けます。

```sh
git clone https://github.com/takacc1/homePage.git
cd homePage
python3 -m http.server 8000 --directory public
```

ブラウザで [http://localhost:8000](http://localhost:8000) にアクセスしてください。
`public/index.html` をブラウザで直接開いて確認することもできます。

## ファイル構成

```text
public/
  index.html          トップページ
  achievements.html   実績・活動歴
  rikujou.html        陸上競技
  bike.html           ロードバイク
  machine.html        自作PC・機械
  photo.html          写真ギャラリー
  music.html          音楽
  carp.html           広島東洋カープ
  kobe.html           神戸
  shibuya.html        渋谷
  assets/
    css/style.css     共通スタイル
    js/script.js      共通の画面操作・演出
    images/           掲載写真
server/
  middleware.js       認証用ミドルウェア
```

## 写真について

サイト内の写真は自身で撮影したものです。

© 2025-2026 All rights reserved.
