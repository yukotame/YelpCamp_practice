# YelpCamp 要件定義書

## 1. プロジェクト概要

**プロジェクト名:** YelpCamp（日本語版）  
**概要:** 全国のキャンプ場情報を共有・レビューできるWebアプリケーション  
**技術スタック:** Node.js / Express / MongoDB / EJS / Bootstrap 5 / Mapbox

---

## 2. 機能要件

### 2.1 ユーザー管理機能

| ID | 機能 | 説明 |
|----|------|------|
| U-01 | ユーザー登録 | ユーザー名・メールアドレス・パスワードで新規登録 |
| U-02 | ログイン | ユーザー名・パスワードによる認証 |
| U-03 | ログアウト | セッション破棄によるログアウト |
| U-04 | 認証状態管理 | ログイン状態に応じたUI表示切替 |
| U-05 | リダイレクト | ログイン後に元のページへリダイレクト |

### 2.2 キャンプ場管理機能

| ID | 機能 | 説明 |
|----|------|------|
| C-01 | 一覧表示 | 登録済みキャンプ場の一覧表示（クラスターマップ付き） |
| C-02 | 詳細表示 | キャンプ場の詳細情報・地図・レビュー表示 |
| C-03 | 新規登録 | タイトル・場所・価格・説明・画像を入力して登録（要ログイン） |
| C-04 | 編集 | 登録済みキャンプ場情報の編集（作成者のみ） |
| C-05 | 削除 | キャンプ場の削除（作成者のみ、関連レビューも一括削除） |
| C-06 | 画像アップロード | 複数画像のアップロード（Cloudinary経由） |
| C-07 | 画像削除 | 編集画面での個別画像削除 |
| C-08 | ジオコーディング | 場所名から緯度経度を自動取得（Mapbox Geocoding API） |

### 2.3 レビュー機能

| ID | 機能 | 説明 |
|----|------|------|
| R-01 | レビュー投稿 | 星評価（1〜5）とコメントの投稿（要ログイン） |
| R-02 | レビュー削除 | 自身のレビューの削除（レビュー作成者のみ） |
| R-03 | レビュー表示 | キャンプ場詳細ページでのレビュー一覧表示 |

### 2.4 地図機能

| ID | 機能 | 説明 |
|----|------|------|
| M-01 | クラスターマップ | 一覧ページでキャンプ場の位置をクラスター表示 |
| M-02 | 詳細マップ | 個別キャンプ場の位置をピン表示 |
| M-03 | ポップアップ | マップ上のマーカークリックでキャンプ場情報表示 |

---

## 3. 非機能要件

### 3.1 セキュリティ

| ID | 要件 | 実装方法 |
|----|------|----------|
| S-01 | パスワードハッシュ化 | passport-local-mongoose |
| S-02 | セッション管理 | express-session + connect-mongo |
| S-03 | 入力サニタイズ | sanitize-html（HTMLエスケープ） |
| S-04 | NoSQLインジェクション対策 | express-mongo-sanitize |
| S-05 | CSP（Content Security Policy） | helmet |
| S-06 | バリデーション | Joi（サーバーサイド） + Bootstrap（クライアントサイド） |
| S-07 | 認可制御 | ミドルウェアによる作成者チェック |

### 3.2 パフォーマンス・運用

| ID | 要件 | 説明 |
|----|------|------|
| P-01 | 画像最適化 | Cloudinaryのtransformationによるサムネイル生成 |
| P-02 | セッションストア | MongoDBベースのセッション永続化 |
| P-03 | 環境変数管理 | dotenvによる環境変数の分離 |
| P-04 | 本番/開発環境分離 | NODE_ENVによる設定切替 |

---

## 4. 画面一覧

| 画面名 | URL | 説明 |
|--------|-----|------|
| ホーム | `/` | ランディングページ |
| キャンプ場一覧 | `/campgrounds` | クラスターマップ + カード一覧 |
| キャンプ場詳細 | `/campgrounds/:id` | 詳細情報・地図・レビュー |
| キャンプ場新規登録 | `/campgrounds/new` | 登録フォーム |
| キャンプ場編集 | `/campgrounds/:id/edit` | 編集フォーム |
| ユーザー登録 | `/register` | 新規ユーザー登録フォーム |
| ログイン | `/login` | ログインフォーム |
| エラー | - | エラーメッセージ表示 |

---

## 5. データモデル

### 5.1 Campground

| フィールド | 型 | 必須 | 説明 |
|------------|-----|------|------|
| title | String | ○ | キャンプ場名 |
| images | [{ url: String, filename: String }] | - | 画像配列 |
| geometry | { type: String, coordinates: [Number] } | ○ | GeoJSON Point |
| price | Number | ○ | 価格（円） |
| description | String | ○ | 説明文 |
| location | String | ○ | 所在地 |
| author | ObjectId (User) | ○ | 作成者 |
| reviews | [ObjectId (Review)] | - | レビュー配列 |

### 5.2 Review

| フィールド | 型 | 必須 | 説明 |
|------------|-----|------|------|
| body | String | ○ | レビュー本文 |
| rating | Number | ○ | 評価（1〜5） |
| author | ObjectId (User) | ○ | レビュー作成者 |

### 5.3 User

| フィールド | 型 | 必須 | 説明 |
|------------|-----|------|------|
| email | String | ○ | メールアドレス（ユニーク） |
| username | String | ○ | ユーザー名（passport-local-mongooseが自動管理） |
| password | - | ○ | パスワード（ハッシュ化して保存、passport-local-mongooseが管理） |

---

## 6. 外部サービス

| サービス | 用途 | 必要なキー |
|----------|------|------------|
| MongoDB Atlas | データベース | DB_URL |
| Cloudinary | 画像ストレージ | CLOUDINARY_CLOUD_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET |
| Mapbox | 地図表示・ジオコーディング | MAPBOX_TOKEN |

---

## 7. 環境変数一覧

```
DB_URL=mongodb+srv://...
SECRET=<セッションシークレット>
CLOUDINARY_CLOUD_NAME=<Cloudinary名>
CLOUDINARY_KEY=<CloudinaryAPIキー>
CLOUDINARY_SECRET=<Cloudinaryシークレット>
MAPBOX_TOKEN=<Mapboxアクセストークン>
PORT=3000
```
