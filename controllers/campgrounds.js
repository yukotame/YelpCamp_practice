import { Campground } from "../models/campground.js";

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
export const createCampground = async(req ,res )=>{
 
    const camp = new Campground(req.body.campground);
    //★★★ここが不明
    camp.author = req.user._id;
    console.log("post index!!! camp.author :" , camp.author )
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
     console.log("キャンプ場詳細ページ campGround", campGround)
     
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
    const { id } = req.params;
    const UpdateCampground = await Campground.findByIdAndUpdate(
    id,    
    {...req.body.campground},
    { new: true } // 更新後のデータを返す
    );

    //flashに登録
    req.flash('success','新しいキャンプ場を更新しました。')
    console.log("UpdateCampground" , UpdateCampground);
    res.redirect(`campgrounds/${UpdateCampground._id}`)  
    
} 