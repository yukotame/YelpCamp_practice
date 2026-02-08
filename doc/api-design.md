# YelpCamp API設計書

## ルーティング一覧

### キャンプ場（/campgrounds）

| メソッド | パス | ミドルウェア | コントローラー | 説明 |
|----------|------|-------------|----------------|------|
| GET | `/campgrounds` | - | `campgrounds.index` | 一覧表示 |
| POST | `/campgrounds` | `isLoggedIn`, `upload.array('image')`, `validateCampground` | `campgrounds.createCampground` | 新規登録 |
| GET | `/campgrounds/new` | `isLoggedIn` | `campgrounds.renderNewForm` | 登録フォーム表示 |
| GET | `/campgrounds/:id` | - | `campgrounds.showCampground` | 詳細表示 |
| PUT | `/campgrounds/:id` | `isLoggedIn`, `isAuthor`, `upload.array('image')`, `validateCampground` | `campgrounds.updateCampground` | 更新 |
| DELETE | `/campgrounds/:id` | `isLoggedIn`, `isAuthor` | `campgrounds.deleteCampground` | 削除 |
| GET | `/campgrounds/:id/edit` | `isLoggedIn`, `isAuthor` | `campgrounds.renderEditForm` | 編集フォーム表示 |

### レビュー（/campgrounds/:id/reviews）

| メソッド | パス | ミドルウェア | コントローラー | 説明 |
|----------|------|-------------|----------------|------|
| POST | `/campgrounds/:id/reviews` | `isLoggedIn`, `validateReview` | `reviews.createReview` | レビュー投稿 |
| DELETE | `/campgrounds/:id/reviews/:reviewId` | `isLoggedIn`, `isReviewAuthor` | `reviews.deleteReview` | レビュー削除 |

### ユーザー（/）

| メソッド | パス | ミドルウェア | コントローラー | 説明 |
|----------|------|-------------|----------------|------|
| GET | `/register` | - | `users.renderRegister` | 登録フォーム表示 |
| POST | `/register` | - | `users.register` | ユーザー登録 |
| GET | `/login` | - | `users.renderLogin` | ログインフォーム表示 |
| POST | `/login` | `passport.authenticate('local')` | `users.login` | ログイン |
| GET | `/logout` | - | `users.logout` | ログアウト |

---

## ミドルウェア一覧

| 名前 | ファイル | 説明 |
|------|----------|------|
| `isLoggedIn` | `middleware.js` | 認証チェック。未ログイン時はリクエストURLを保存しログインページへリダイレクト |
| `isAuthor` | `middleware.js` | キャンプ場の作成者チェック。権限がない場合はフラッシュメッセージ付きリダイレクト |
| `isReviewAuthor` | `middleware.js` | レビューの作成者チェック |
| `validateCampground` | `middleware.js` | Joiによるキャンプ場データバリデーション |
| `validateReview` | `middleware.js` | Joiによるレビューデータバリデーション |

---

## バリデーションスキーマ

### campgroundSchema

```javascript
{
  campground: {
    title: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(0),
    location: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML()
  },
  deleteImages: Joi.array()  // オプション
}
```

### reviewSchema

```javascript
{
  review: {
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML()
  }
}
```

---

## フラッシュメッセージ一覧

| キー | メッセージ | 発生場面 |
|------|-----------|----------|
| success | 新しいキャンプ場を登録しました | キャンプ場新規登録成功 |
| success | キャンプ場を更新しました | キャンプ場更新成功 |
| success | キャンプ場を削除しました | キャンプ場削除成功 |
| success | レビューを登録しました | レビュー投稿成功 |
| success | レビューを削除しました | レビュー削除成功 |
| success | Yelp Campへようこそ！ | 新規ユーザー登録成功 |
| success | おかえりなさい！！ | ログイン成功 |
| success | ログアウトしました | ログアウト成功 |
| error | ログインしてください | 未認証アクセス |
| error | そのアクションの権限がありません | 認可エラー |
| error | キャンプ場は見つかりませんでした | キャンプ場未発見 |
