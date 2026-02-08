# YelpCamp コマンド一覧

## 1. プロジェクト初期化

```bash
# プロジェクトディレクトリ作成・移動
mkdir YelpCamp
cd YelpCamp

# npm初期化
npm init -y
```

---

## 2. Git初期化 & GitHub連携

```bash
# Git初期化
git init

# .gitignore作成
echo node_modules > .gitignore
echo .env >> .gitignore
echo .DS_Store >> .gitignore

# GitHubリポジトリ作成後、リモート追加（URLは自分のリポジトリに変更）
git remote add origin https://github.com/<ユーザー名>/YelpCamp.git
```

---

## 3. 依存パッケージインストール

```bash
# Webフレームワーク・テンプレートエンジン
npm install express ejs ejs-mate method-override

# データベース
npm install mongoose mongodb

# 環境変数
npm install dotenv

# セッション・フラッシュ
npm install express-session connect-flash connect-mongo

# 認証
npm install passport passport-local passport-local-mongoose

# 画像アップロード（Cloudinary）
npm install cloudinary multer multer-storage-cloudinary

# 地図（Mapbox）
npm install @mapbox/mapbox-sdk

# バリデーション
npm install joi

# セキュリティ
npm install helmet express-mongo-sanitize sanitize-html
```

### 一括インストール（コピペ用）

```bash
npm install express mongoose mongodb ejs ejs-mate method-override dotenv express-session connect-flash connect-mongo passport passport-local passport-local-mongoose cloudinary multer multer-storage-cloudinary @mapbox/mapbox-sdk joi helmet express-mongo-sanitize sanitize-html
```

---

## 4. ディレクトリ構成作成

```bash
# ディレクトリ一括作成
mkdir cloudinary
mkdir controllers
mkdir models
mkdir public
mkdir public\javascripts
mkdir public\stylesheets
mkdir routes
mkdir seeds
mkdir utils
mkdir views
mkdir views\campgrounds
mkdir views\layouts
mkdir views\partials
mkdir views\users
mkdir doc
```

### Mac/Linux の場合

```bash
mkdir -p cloudinary controllers models public/javascripts public/stylesheets routes seeds utils views/campgrounds views/layouts views/partials views/users doc
```

---

## 5. 環境変数ファイル作成

```bash
# .envファイル作成（中身は手動で編集）
echo DB_URL=mongodb://localhost:27017/yelp-camp > .env
echo SECRET=thisshouldbeabettersecret >> .env
echo CLOUDINARY_CLOUD_NAME=your_cloud_name >> .env
echo CLOUDINARY_KEY=your_api_key >> .env
echo CLOUDINARY_SECRET=your_api_secret >> .env
echo MAPBOX_TOKEN=your_mapbox_token >> .env
echo PORT=3000 >> .env
```

---

## 6. MongoDB起動

```bash
# ローカルMongoDBの場合
mongod

# MongoDB Atlasの場合は.envのDB_URLに接続文字列を設定
```

---

## 7. シードデータ投入

```bash
node seeds/index.js
```

---

## 8. アプリケーション起動

```bash
# 通常起動
node app.js

# package.jsonのscriptで起動
npm start
```

ブラウザで http://localhost:3000 にアクセス

---

## 9. Git コミット & GitHub Push

### 初回コミット & Push

```bash
# 全ファイルをステージング
git add .

# 初回コミット
git commit -m "Initial commit: YelpCamp プロジェクト初期設定"

# メインブランチに変更（必要な場合）
git branch -M main

# GitHubへPush
git push -u origin main
```

### フェーズごとのコミット例

```bash
# フェーズ1: キャンプ場のCRUD
git add .
git commit -m "feat: キャンプ場CRUD（モデル, シードデータ, ルーティング, ビュー）"
git push

# フェーズ2: 基本的なスタイルをあてる
git add .
git commit -m "feat: スタイル適用（ejs-mate, Bootstrap, boilerplate, navbar, footer）"
git push

# フェーズ3: エラーハンドリングとバリデーション
git add .
git commit -m "feat: エラーハンドリングとバリデーション（ExpressError, catchAsync, Joi）"
git push

# フェーズ4: レビューモデルの追加
git add .
git commit -m "feat: レビュー機能（Reviewモデル, 投稿, 削除, カスケード削除）"
git push

# フェーズ5: リファクタとフラッシュ
git add .
git commit -m "feat: リファクタ（Expressルーター分離, セッション, フラッシュメッセージ）"
git push

# フェーズ6: 認証を追加する
git add .
git commit -m "feat: ユーザー認証（Passport, 登録, ログイン, ログアウト）"
git push

# フェーズ7: 基本的な認可を追加
git add .
git commit -m "feat: 認可（isAuthor, isReviewAuthor, 作成者チェック）"
git push

# フェーズ8: コントローラーと星を使った評価
git add .
git commit -m "feat: コントローラー分離と星評価UI（starability CSS）"
git push

# フェーズ9: 画像アップロード
git add .
git commit -m "feat: 画像アップロード（Cloudinary, multer, サムネイル）"
git push

# フェーズ10: 地図の追加
git add .
git commit -m "feat: 地図追加（Mapbox, ジオコーディング, 詳細ページマップ）"
git push

# フェーズ11: クラスターマップ
git add .
git commit -m "feat: クラスターマップ（一覧ページのクラスター表示）"
git push

# フェーズ12: スタイルの最終仕上げ
git add .
git commit -m "feat: スタイル最終仕上げ（レイアウト改善, レスポンシブ対応）"
git push

# フェーズ13: よくあるセキュリティ課題への対処
git add .
git commit -m "feat: セキュリティ強化（helmet, CSP, sanitize, mongo-sanitize）"
git push

# フェーズ14: デプロイ
git add .
git commit -m "feat: デプロイ準備（MongoDB Atlas, 環境変数整理, README）"
git push
```

---

## 10. よく使うコマンド

```bash
# 現在のGit状態確認
git status

# 変更差分の確認
git diff

# コミット履歴確認
git log --oneline

# ブランチ作成・切替
git checkout -b feature/新機能名

# ブランチをmainにマージ
git checkout main
git merge feature/新機能名

# リモートの変更を取得
git pull origin main

# node_modulesの再インストール（問題発生時）
rm -rf node_modules
npm install

# MongoDBシェルでデータ確認
mongosh
use yelp-camp
db.campgrounds.find()
db.reviews.find()
db.users.find()
```
