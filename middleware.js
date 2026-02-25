import ExpressError from './utils/ExpressError.js';
import { Campground } from "./models/campground.js";
import { reviewSchema } from './schemas.js';
import {Review} from './models/review.js';
import { campgroundSchema } from './schemas.js';
//ログインしないと入れないページを守る
export const isLoggedIn = (req,res,next)=>{
    console.log(" req.originalUrl" ,  req.originalUrl)
    //もともとリクエストしたページを保存しておく
    req.session.returnTo = req.originalUrl;
    // deserializeされたuserが入る
    console.log("req.user" , req.user);
    if(!req.isAuthenticated()){
        req.flash("error" , "ログインしてください！")
        return res.redirect('/login')
    }

next();
}

//ログイン前に入ろうとしたURL
export const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

//キャンプ場のバリデーションチェック
export  const validateCampGround = (req , res , next)=>{
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

//レビューのバリデーションチェック
export const validateReview = (req , res , next)=>{
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


//レビュー権限などの確認
export const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'そのアクションの権限がありません');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


//レビュー削除権限
// /campgrounds/:id/reviews/:reviewId
export const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'そのアクションの権限がありません');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}