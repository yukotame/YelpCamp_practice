# YelpCamp ディレクトリ構成

```
YelpCamp/
├── .env                        # 環境変数（Git管理外）
├── .gitignore                  # Git除外設定
├── app.js                      # アプリケーションエントリーポイント
├── middleware.js                # カスタムミドルウェア
├── schemas.js                  # Joiバリデーションスキーマ
├── package.json                # 依存パッケージ管理
│
├── cloudinary/
│   └── index.js                # Cloudinary設定・ストレージ設定
│
├── controllers/
│   ├── campgrounds.js          # キャンプ場コントローラー
│   ├── reviews.js              # レビューコントローラー
│   └── users.js                # ユーザーコントローラー
│
├── models/
│   ├── campground.js           # Campgroundモデル（ImageSchema含む）
│   ├── review.js               # Reviewモデル
│   └── user.js                 # Userモデル（passport-local-mongoose）
│
├── public/
│   ├── javascripts/
│   │   ├── clusterMap.js       # 一覧ページ用クラスターマップ
│   │   ├── showPageMap.js      # 詳細ページ用マップ
│   │   └── validateForms.js    # フォームバリデーション
│   └── stylesheets/
│       ├── app.css             # アプリ共通スタイル
│       ├── home.css            # ホームページ専用スタイル
│       └── stars.css           # 星評価スタイル
│
├── routes/
│   ├── campgrounds.js          # キャンプ場ルーティング
│   ├── reviews.js              # レビュールーティング
│   └── users.js                # ユーザールーティング
│
├── seeds/
│   ├── cities.js               # 日本の都市データ（緯度経度）
│   ├── index.js                # シードスクリプト
│   └── seedHelpers.js          # ランダム名前生成ヘルパー
│
├── utils/
│   ├── catchAsync.js           # 非同期エラーキャッチラッパー
│   └── ExpressError.js         # カスタムエラークラス
│
├── views/
│   ├── error.ejs               # エラーページ
│   ├── home.ejs                # ホームページ（独自レイアウト）
│   ├── campgrounds/
│   │   ├── edit.ejs            # キャンプ場編集
│   │   ├── index.ejs           # キャンプ場一覧
│   │   ├── new.ejs             # キャンプ場新規登録
│   │   └── show.ejs            # キャンプ場詳細
│   ├── layouts/
│   │   └── boilerplate.ejs     # 共通レイアウト
│   ├── partials/
│   │   ├── flash.ejs           # フラッシュメッセージ
│   │   ├── footer.ejs          # フッター
│   │   └── navbar.ejs          # ナビゲーションバー
│   └── users/
│       ├── login.ejs           # ログインページ
│       └── register.ejs        # ユーザー登録ページ
│
└── doc/
    ├── requirements.md         # 要件定義書
    ├── tasks.md                # タスク一覧
    ├── api-design.md           # API設計書
    ├── directory-structure.md  # ディレクトリ構成
    └── setup-guide.md          # セットアップガイド
```

---

## 各ディレクトリの役割

| ディレクトリ | 役割 | パターン |
|-------------|------|----------|
| `controllers/` | ビジネスロジック | MVC - Controller |
| `models/` | データモデル定義 | MVC - Model |
| `views/` | テンプレート（EJS） | MVC - View |
| `routes/` | URLルーティング定義 | Express Router |
| `middleware.js` | 認証・認可・バリデーション | Express Middleware |
| `schemas.js` | リクエストバリデーション | Joi Schema |
| `utils/` | 汎用ユーティリティ | Helper |
| `cloudinary/` | 外部サービス設定 | Service Config |
| `seeds/` | 開発用データ投入 | Database Seeder |
| `public/` | 静的ファイル配信 | Static Assets |
