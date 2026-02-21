// 必要なパッケージをインポート
// express: Webアプリケーションフレームワーク
// mongoose: MongoDBとの接続と操作
// ejs-mate: EJSテンプレートエンジンの拡張
// dotenv: 環境変数の管理
// method-override: HTMLフォームでPUTやDELETEメソッドを使用可能にする
// path: ファイルパス操作のためのNode.js組み込みモジュール
import express from "express";
// 環境変数の読み込み
// .envファイルから環境変数をロードして、プロジェクト全体で使用可能にする
import path from 'path';
import { fileURLToPath } from 'url';
import  mongoose  from "mongoose";
import Joi from "joi";
import methodOverride from 'method-override';
import ejsMate from 'ejs-mate';
import ExpressError from './utils/ExpressError.js';
import campgroundRouter from "./routes/campgrounds.js"
import reviewRouter from "./routes/reviews.js"
import session from "express-session";
import flash from "connect-flash";
const dbUrl = "mongodb://localhost:27017/yelp-camp"; // データベースURLを指定



// Mongooseの接続処理
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex : true,
    useFindAndModify:false
}).then(() => {
    console.log("MongoDBに接続しました！");
}).catch(err => {
    console.error("MongoDB接続エラー:", err);
});

// __dirname を自作する（ESモジュールでは標準で存在しないため）
//import.meta.url: 今実行しているファイル自体の場所を指します。
const __filename = fileURLToPath(import.meta.url);
//ファイル名を除いた「ディレクトリ（フォルダ）名」だけを取り出
const __dirname = path.dirname(__filename);


const app = express();
app.engine('ejs' , ejsMate);
app.set('view engine' , 'ejs');
// 設定
//__dirname D:\MyApp\YelpCamp_app
app.set('views', path.join(__dirname, 'views'));

// app.js の上の方に記述
app.use(express.json());
// この設定が true になっていることで、[ ] を使った階層構造を解析できるようになります req.bodyがundefinedにならない
app.use(express.urlencoded({ extended: true }));

// Middleware for method override ?_method=DELETEの使用許可
app.use(methodOverride('_method'));
//静的ファイルをつかえるようにする
app.use(express.static(path.join(__dirname, 'public')))


// セッションのミドルウェア設定
const sessionConfig={
secret: 'my-secret', // 署名用の秘密鍵（適当な長い文字列）
  resave: false,             // セッションに変更がなくても保存するか
  saveUninitialized: true,  // 初期化されていないセッションを保存するか
  cookie: {
    httpOnly:true,
    maxAge: 60 * 60 * 1000,  // 有効期限（ミリ秒：ここでは1時間）ChormeのCookieのExpiresでみれる！
    secure: false            // HTTPSならtrueにする
  }
}
//セッションIDが発行される。
app.use(session(sessionConfig));
// connect-flash の有効化
app.use(flash());
//localsでどこでもflashがつかえるように
app.use((req, res, next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
     next();
 });

app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/reviews', reviewRouter);

app.get('/', (req ,res)=>{
    res.render('home')    
})

//all すべてのメソッド
app.all(/.*/, (req,res,next)=>{    
    next(new ExpressError("ページが見つかりません" , 404));
})

app.use((err, req, res, next)=>{
    // console.log("エラー内容:", err);
    const {msg ="問題が発生しました" , status=500} = err;
    res.status(status).render('error', {err});
   
})


app.listen(3000, ()=>{    
    console.log("PORT 3000 でリクエスト待ち受け中・・・");
})

// Expressアプリケーションの初期化
// 必要なミドルウェアを設定する（例: JSONパース、URLエンコード）

// EJSテンプレートエンジンの設定
// viewsディレクトリを指定し、テンプレートエンジンとしてEJSを使用

// 静的ファイルの提供
// publicディレクトリ内のCSSや画像ファイルをクライアントに提供

// MongoDBとの接続
// mongooseを使用してMongoDBに接続。接続エラー時の処理も記載

// ルーティングの設定
// 各種ルート（例: キャンプ場のCRUD操作）を設定
// ルートはroutesディレクトリに分離して管理

// エラーハンドリング
// 404エラーやその他のエラーをキャッチして適切なレスポンスを返す

// サーバーの起動
// 指定したポートでサーバーを起動し、リクエストを受け付ける