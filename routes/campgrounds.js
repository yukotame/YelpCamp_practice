import express from 'express';
import { catchAsync } from "../utils/catchAsync.js"
import ExpressError from '../utils/ExpressError.js';
import { Campground } from "../models/campground.js";
import { campgroundSchema } from '../schemas.js';

const router = express.Router(); 
const validateCampGround = (req , res , next)=>{
       // console.log("req.body.campground:" , req.body.campground);
    //サーバサイドのエラー対応
    // if(!req.body.campground) throw new ExpressError("不正なデータです。", 400);
    //Joiでサーバサイドのエラー対応

    const { error, value } = campgroundSchema.validate(req.body);

    if (error) {
        console.log("バリデーションエラー:", error.details);
        //エラーメッセージだけの配列をjoinでつなげる。
        const msg =error.details.map((detail)=>detail.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        console.log("バリデーション成功:", value);
        next();
    }
    console.log("errorResult" , error);

}
//キャンプ場一覧の表示　
// req クライアント（ブラウザ）から送られてきた情報が全部入っている箱
// resサーバーからブラウザへ返すための箱
router.get('/' , catchAsync(async(req , res )=>{
    
    const campGroundsAll = await Campground.find({});
    //views/campgrounds/index.ejs というファイルを探す
    res.render('campgrounds/index' , {campGroundsAll})
}))

//キャンプ場登録画面
router.get('/new' , (req ,res )=>{
    //path: view/campgrounds/new に遷移
    res.render('campgrounds/new' )
})

//キャンプ場登録処理
router.post('/' ,validateCampGround,  catchAsync(async(req ,res )=>{
 
    const camp = new Campground(req.body.campground)
    await camp.save();
    //flashに登録
    req.flash('success','新しいキャンプ場を登録しました。')
    res.redirect(`/campgrounds/${camp._id}`)
    // res.render('campgrounds' )
}))

//キャンプ場詳細ページの表示
router.get('/:id' , catchAsync(async(req ,res )=>{
    const { id } = req.params;
   
    const campGround = await Campground.findById(id).populate('reviews');
    //path: view/campgrounds/show に遷移
    console.log("campGround", campGround)
    
    if(!campGround){
        //flashに登録
        req.flash('error','キャンプ場は見つかりませんでした。');
        return res.redirect('/campgrounds');
    }
    //localsで渡す方がよい
    // res.render('campgrounds/show' ,{campGround , success:req.flash('success')})

    res.render('campgrounds/show' ,{campGround })
}))



//キャンプ場詳細->抹消
router.delete('/:id' , catchAsync(async(req ,res )=>{
    // console.log("del reviews" );
    const { id } = req.params;
    const reviews = await Campground.findById(id).populate('reviews');
    console.log("del reviews" , reviews);
    await Campground.findByIdAndDelete(id); // MongoDBから該当するキャンプ場を削除


    res.redirect('/campgrounds'); // 削除後にリダイレクト
    // console.log("削除できた")

    // console.error(err);
    // res.status(500).send('キャンプ場の削除中にエラーが発生しました');
      
}))

//キャンプ場編集画面表示
router.get('/:id/edit' , catchAsync(async(req ,res )=>{
    
    const { id } = req.params;
    const campGround = await Campground.findById(id);
    if(!campGround){
        //flashに登録
        req.flash('error','キャンプ場は見つかりませんでした。');
        return res.redirect('/campgrounds');
    }
    //flashに登録
    req.flash('success','新しいキャンプ場を更新しました。')
    //path: view/campgrounds/show に遷移
    res.render('campgrounds/edit' ,{campGround})
   
}))

//キャンプ場編集画面表示
router.put('/:id' , validateCampGround , catchAsync(async(req ,res )=>{
console.log("PUT!!!", req.body.campground)

    const { id } = req.params;
 
    const UpdateCampground = await Campground.findByIdAndUpdate(
    id,
    
    {...req.body.campground},
    { new: true } // 更新後のデータを返す
    );

    //flashに登録
    req.flash('success','新しいキャンプ場を削除しました。')
    console.log("UpdateCampground" , UpdateCampground);
    res.redirect(`/campgrounds/${UpdateCampground._id}`)

    console.error(err);
    // res.status(500).send('キャンプ場の削除中にエラーが発生しました');
    
}))

export default router;
