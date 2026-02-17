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
import { Campground } from "./models/campground.js";
import methodOverride from 'method-override';
import ejsMate from 'ejs-mate';
import { catchAsync } from "./utils/catchAsync.js";
import ExpressError from './utils/ExpressError.js';

const dbUrl = "mongodb://localhost:27017/yelp-camp"; // データベースURLを指定

// Mongooseの接続処理
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex : true
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

// この設定が true になっていることで、[ ] を使った階層構造を解析できるようになります req.bodyがundefinedにならない
app.use(express.urlencoded({ extended: true }));

// Middleware for method override ?_method=DELETEの使用許可
app.use(methodOverride('_method'));

app.get('/', (req ,res)=>{
    res.render('home')
    
})

//キャンプ場一覧の表示　
// req クライアント（ブラウザ）から送られてきた情報が全部入っている箱
// resサーバーからブラウザへ返すための箱
app.get('/campgrounds' , catchAsync(async(req , res )=>{
    
    const campGroundsAll = await Campground.find({});
    //views/campgrounds/index.ejs というファイルを探す
    res.render('campgrounds/index' , {campGroundsAll})
}))

//キャンプ場登録画面
app.get('/campgrounds/new' , (req ,res )=>{
    //path: view/campgrounds/new に遷移
    res.render('campgrounds/new' )
})

//キャンプ場登録処理
app.post('/campgrounds' , catchAsync(async(req ,res )=>{
    console.log("req.body.campground:" , req.body.campground);
    if(!req.body.campground) throw new ExpressError("不正なデータです。", 400)
    const camp = new Campground(req.body.campground)
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`)
    // res.render('campgrounds' )
}))

//キャンプ場詳細ページの表示
app.get('/campgrounds/:id' , catchAsync(async(req ,res )=>{
    const { id } = req.params;
    const campGround = await Campground.findById(id);
    //path: view/campgrounds/show に遷移
    res.render('campgrounds/show' ,{campGround})
}))

//キャンプ場詳細->抹消
app.delete('/campgrounds/:id' , catchAsync(async(req ,res )=>{
    
    const { id } = req.params;

    await Campground.findByIdAndDelete(id); // MongoDBから該当するキャンプ場を削除
    res.redirect('/campgrounds'); // 削除後にリダイレクト
    console.log("削除できた")

    console.error(err);
    res.status(500).send('キャンプ場の削除中にエラーが発生しました');
      
}))

//キャンプ場編集画面表示
app.get('/campgrounds/:id/edit' , catchAsync(async(req ,res )=>{
    const { id } = req.params;
    const campGround = await Campground.findById(id);
    //path: view/campgrounds/show に遷移
    res.render('campgrounds/edit' ,{campGround})
   
}))

//キャンプ場編集画面表示
app.put('/campgrounds/:id' , catchAsync(async(req ,res )=>{
console.log("PUT!!!", req.body.campground)

    const { id } = req.params;
 
        const UpdateCampground = await Campground.findByIdAndUpdate(
        id,
        
        {...req.body.campground},
        { new: true } // 更新後のデータを返す
        );
        console.log("UpdateCampground" , UpdateCampground);
        res.redirect(`/campgrounds/${UpdateCampground._id}`)

        console.error(err);
        res.status(500).send('キャンプ場の削除中にエラーが発生しました');
    
}))

//all すべてのメソッド
app.all(/.*/, (req,res,next)=>{
    
    next(new ExpressError("ページが見つかりません" , 404));
})

app.use((err, req, res, next)=>{

    console.log("エラー内容:", err);
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