# YelpCamp セットアップガイド

## 前提条件

- **Node.js** v14以上
- **MongoDB** v4以上（ローカル or MongoDB Atlas）
- **Git**

以下の外部サービスのアカウントが必要：
- [Cloudinary](https://cloudinary.com/) - 画像ストレージ
- [Mapbox](https://www.mapbox.com/) - 地図・ジオコーディング

---

## 手順

### 1. プロジェクト初期化

```bash
mkdir YelpCamp
cd YelpCamp
npm init -y
```

### 2. 依存パッケージインストール

```bash
npm install express mongoose ejs ejs-mate method-override dotenv \
  express-session connect-flash connect-mongo \
  passport passport-local passport-local-mongoose \
  cloudinary multer multer-storage-cloudinary \
  @mapbox/mapbox-sdk \
  joi sanitize-html express-mongo-sanitize helmet \
  mongodb
```
npm i express mongoose@5 ejs

### 3. 環境変数設定

プロジェクトルートに `.env` ファイルを作成：

```env
DB_URL=mongodb://localhost:27017/yelp-camp
SECRET=thisshouldbeabettersecret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
MAPBOX_TOKEN=your_mapbox_token
PORT=3000
```

### 4. .gitignore設定

```
node_modules
.env
.DS_Store
```

### 5. ディレクトリ作成

```bash
mkdir -p cloudinary controllers models public/javascripts public/stylesheets routes seeds utils views/campgrounds views/layouts views/partials views/users doc
```

### 6. 開発順序

以下の順番で各ファイルを作成していく（詳細はtasks.mdを参照）：

#### Step 1: ユーティリティ
1. `utils/ExpressError.js` - カスタムエラークラス
2. `utils/catchAsync.js` - 非同期エラーキャッチ

#### Step 2: モデル
3. `models/campground.js` - キャンプ場モデル
4. `models/review.js` - レビューモデル
5. `models/user.js` - ユーザーモデル

#### Step 3: 設定ファイル
6. `cloudinary/index.js` - Cloudinary設定
7. `schemas.js` - Joiバリデーション
8. `middleware.js` - カスタムミドルウェア

#### Step 4: コントローラー
9. `controllers/campgrounds.js`
10. `controllers/reviews.js`
11. `controllers/users.js`

#### Step 5: ルーター
12. `routes/campgrounds.js`
13. `routes/reviews.js`
14. `routes/users.js`

#### Step 6: ビュー（レイアウト・パーシャル）
15. `views/layouts/boilerplate.ejs`
16. `views/partials/navbar.ejs`
17. `views/partials/footer.ejs`
18. `views/partials/flash.ejs`

#### Step 7: ビュー（ページ）
19. `views/home.ejs`
20. `views/error.ejs`
21. `views/campgrounds/index.ejs`
22. `views/campgrounds/show.ejs`
23. `views/campgrounds/new.ejs`
24. `views/campgrounds/edit.ejs`
25. `views/users/register.ejs`
26. `views/users/login.ejs`

#### Step 8: クライアントサイドJS
27. `public/javascripts/clusterMap.js`
28. `public/javascripts/showPageMap.js`
29. `public/javascripts/validateForms.js`

#### Step 9: CSS
30. `public/stylesheets/app.css`
31. `public/stylesheets/home.css`
32. `public/stylesheets/stars.css`

#### Step 10: メインアプリケーション
33. `app.js` - すべてを結合

#### Step 11: シードデータ
34. `seeds/cities.js`
35. `seeds/seedHelpers.js`
36. `seeds/index.js`

### 7. データベースシード実行

```bash
node seeds/index.js
```

### 8. アプリケーション起動

```bash
node app.js
```

ブラウザで http://localhost:3000 にアクセス。

---

## トラブルシューティング

| 問題 | 解決策 |
|------|--------|
| MongoDBに接続できない | MongoDBが起動しているか確認。`mongod`コマンドで起動 |
| Mapboxの地図が表示されない | `.env`のMAPBOX_TOKENを確認。CSPの許可リストを確認 |
| 画像アップロードが失敗する | Cloudinaryの認証情報を確認。`allowed_formats`を確認 |
| CSS/JSが読み込まれない | `express.static`のパス設定を確認 |
| フラッシュメッセージが表示されない | `express-session`と`connect-flash`の設定順序を確認 |
| PUTやDELETEが動かない | `method-override`の設定確認。フォームの`?_method=`を確認 |
