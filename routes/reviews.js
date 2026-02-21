import express from 'express';
import { catchAsync } from "../utils/catchAsync.js"
import ExpressError from '../utils/ExpressError.js';

import { reviewSchema } from '../schemas.js';
import { Campground } from "../models/campground.js";
import { Review } from "../models/review.js";

//campgroundsのidがあることを明示する必要がある。
//app.js側で app.use('/campgrounds/:id/reviews', reviewRouter);を書くため。
const router = express.Router({mergeParams:true}); 
const validateReview = (req , res , next)=>{
       // console.log("req.body.review:" , req.body.review);
    //サーバサイドのエラー対応
    // if(!req.body.review) throw new ExpressError("不正なデータです。", 400);
    //Joiでサーバサイドのエラー対応
    // console.log("リクエストボディ:", req.body);
    const { error, value } = reviewSchema.validate(req.body);

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

//review
//post  campgrounds/:id/reviews
router.post('/' , validateReview , async(req ,res )=>{
    const {id} = req.params;
    console.log("farmId" ,id );
    console.log("review " ,req.body.review );
    const campGround = await Campground.findById(id);
    const review = new Review(req.body.review)
    await review.save(); // レビューを保存
    campGround.reviews.push(review);
    // const camp = new Campground(req.body.campground)
     await campGround.save();

    const campGroundtest = await Campground.findById(id).populate('reviews');
    //path: view/campgrounds/show に遷移
    console.log("campGround test ", campGroundtest)

    //flashに登録
    req.flash('success','レビューを登録しました。')
    res.redirect(`/campgrounds/${campGround._id}`)
    // // res.render('campgrounds' )
})

router.delete('/:reviewId/' ,  async(req ,res )=>{
    const {campgroundId} = req.params;
    const {reviewId} = req.params;
    const deleteReview = await Review.findByIdAndDelete(reviewId);
    // MongoDB pull
    await Campground.findByIdAndUpdate(campgroundId, {$pull:{reviews : reviewId}})
    //flashに登録
    req.flash('success','レビューを削除しました。')
    res.redirect(`/campgrounds/${campgroundId}`)
    // res.send("delete!!!");
})

export default router;