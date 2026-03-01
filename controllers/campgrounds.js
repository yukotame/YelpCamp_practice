import * as maptiler from "@maptiler/client";
import { Campground } from "../models/campground.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
// MapTilerのAPIキー設定
maptiler.config.apiKey = process.env.MAPTILER_API_KEY;



//１．キャンプ場一覧の表示　
export const index = async(req , res )=>{
    console.log("post index!!! ");
    const campGroundsAll = await Campground.find({});
    //views/campgrounds/index.ejs というファイルを探す
    res.render('campgrounds/index' , {campGroundsAll})
}

//２．キャンプ場登録画面の表示
export const renderNewForm = (req ,res )=>{
    //path: view/campgrounds/new に遷移
    res.render('campgrounds/new' )
} 

//３．キャンプ場登録処理
//req.files :ルーティング側でmulterなどのミドルウェアを使っているため。
export const createCampground = async(req ,res )=>{
 
    const geoData = await maptiler.geocoding.forward(
        req.body.campground.location,
        { limit: 1 }
    );

    const camp = new Campground(req.body.campground);
    camp.geometry = geoData.features[0].geometry;
    console.log("位置情報:" , camp.geometry)

    //★★★ここが不明
    camp.author = req.user._id;
    camp.images = req.files.map(f=>({url:f.path , filename:f.filename}));
    await camp.save();
    //flashに登録
    req.flash('success','新しいキャンプ場を登録しました。')
    res.redirect(`/campgrounds/${camp._id}`)
    // res.render('campgrounds' )
}

//４．キャンプ場編集画面表示
export const showCampground =async(req ,res )=>{
     const { id } = req.params;
    
     const campGround = await Campground.findById(id).populate({
                         path: 'reviews', // 1階層目：reviewsフィールド
                         populate: {
                         path: 'author' // 2階層目：reviews内のauthorフィールド
                         }
                     }).populate('author');
     //path: view/campgrounds/show に遷移
     console.log("キャンプ場詳細ページ campGround", campGround.images)
     
     if(!campGround){
         //flashに登録
         req.flash('error','キャンプ場は見つかりませんでした。');
         return res.redirect('campgrounds');
     }
     //localsで渡す方がよい
     // res.render('campgrounds/show' ,{campGround , success:req.flash('success')})
 
     res.render('campgrounds/show' ,{campGround })
 }

//５．キャンプ場詳細->抹消
 export const deleteCampground = async(req ,res )=>{
     // console.log("del reviews" );
     const { id } = req.params;
     const reviews = await Campground.findById(id).populate('reviews');
     console.log("del reviews" , reviews);
     await Campground.findByIdAndDelete(id); // MongoDBから該当するキャンプ場を削除 
     req.flash('success', 'キャンプ場を削除しました');
     res.redirect('/campgrounds'); // 削除後にリダイレクト    
     // console.error(err);
     // res.status(500).send('キャンプ場の削除中にエラーが発生しました');
       
 } 

//６．キャンプ場詳細ページの表示
 export const renderEditForm = async(req ,res )=>{     
     const { id } = req.params;
     const campGround = await Campground.findById(id);
     if(!campGround){
         //flashに登録
         req.flash('error','キャンプ場は見つかりませんでした。');
         return res.redirect('/campgrounds');
             }

     //path: view/campgrounds/show に遷移
     res.render('campgrounds/edit' ,{campGround})
    
 }


 //７．キャンプ場編集処理
 export const updateCampground =  async(req ,res )=>{
    console.log("キャンプ場編集 req.body" , req.body)
    const { id } = req.params;
    const UpdateCampground = await Campground.findByIdAndUpdate(
    id,    
    {...req.body.campground},
    { new: true } // 更新後のデータを返す
    );

    //画像追加
    const images = req.files.map(f=>({url:f.path , filename:f.filename}))
    UpdateCampground.images.push(...images);
    await UpdateCampground.save();

    //削除対象の画像がある場合['safawfwadf' , 'vsafwafwesf']
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages ){
            await cloudinary.uploader.destroy(filename);
        }
        //★難しい
        await Campground.updateOne({$pull:{images : {filename:{$in:req.body.deleteImages}}}})
    }

    //flashに登録
    req.flash('success','新しいキャンプ場を更新しました。')
    console.log("UpdateCampground" , UpdateCampground);
    res.redirect(`/campgrounds/${UpdateCampground._id}`)  
    
} 

// maptilerがつかえるか確認

// MapTilerの動作確認用テスト
async function testMaptiler() {
    try {
        // 例: ジオコーディングAPIで愛知県名古屋市を検索
    const geoData = await maptiler.geocoding.forward(
        '愛知県名古屋市',
        // req.body.campground.location,
        { limit: 1 }
    );
        console.log(geoData);

        console.log('MapTilerテスト結果:', geoData.features[0].geometry);
    } catch (err) {
        console.error('MapTilerテスト失敗:', err);
    }
}
// サーバ起動時に一度だけテスト
// testMaptiler();