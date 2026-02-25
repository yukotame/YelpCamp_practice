import { Review } from "../models/review.js";
import { Campground } from "../models/campground.js";


export const createReview = async(req ,res )=>{
    const {id} = req.params;
    console.log("farmId" ,id );
    console.log("review " ,req.body.review );
    const campGround = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    await review.save(); // レビューを保存
    campGround.reviews.push(review);
    // const camp = new Campground(req.body.campground)
     await campGround.save();
    //flashに登録
    req.flash('success','レビューを登録しました。')
    res.redirect(`/campgrounds/${campGround._id}`)
    // // res.render('campgrounds' )
}

export const deleteReview = async(req ,res )=>{
    const {id} = req.params;
    const {reviewId} = req.params;
    const deleteReview = await Review.findByIdAndDelete(reviewId);
    // MongoDB pull
    await Campground.findByIdAndUpdate(id, {$pull:{reviews : reviewId}})
    //flashに登録
    req.flash('success','レビューを削除しました。')
    res.redirect(`/campgrounds/${id}`)
    // res.send("delete!!!");
}

