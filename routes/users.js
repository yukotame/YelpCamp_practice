import express from 'express';
import { catchAsync } from "../utils/catchAsync.js"
import ExpressError from '../utils/ExpressError.js';
import { User } from "../models/user.js";
import passport from "passport";
import {storeReturnTo} from "../middleware.js"
// import { userSchema } from '../schemas.js';

const router = express.Router(); 

//ユーザー登録画面
router.get('/register' , (req ,res )=>{
    //path: view/users/register に遷移
    res.render('users/register')
})

//ユーザー登録処理
router.post('/register' ,  async(req ,res , next)=>{
    console.log("ユーザー登録です。", req.body)
    try{
        // res.send("登録！！");
        const {username , password , email} = req.body;
        const user = new User({email , username});
        //passport-local-mongoose のReadmd
        // register(user, password, cb) 
        // Convenience method to register a new user instance with a given password. Checks if username is unique.
        const registerUser = await User.register(user, password);

        // 登録後ログインされた状態にする
        req.login(registerUser, err => {
            if (err) return next(err);
            req.flash('success', 'Yelp Campへようこそ！');
            res.redirect('/campgrounds');
        })

    }catch(e){
        req.flash('error' , e.message);
         res.redirect('/register');
    }
})

//ログイン画面
router.get('/login' , (req ,res )=>{
    //path: view/users/register に遷移
    res.render('users/login')
})

//ログイン処理
router.post('/login' ,  
    passport.authenticate('local', { failureRedirect: '/login' , failureFlash:true }), 
    async(req ,res )=>{
    req.flash('success' , 'おかえりなさい');
    const redirectUrl = res.locals.returnTo || '/campgrounds'; // ここを res.locals.returnTo に変更
    res.redirect(redirectUrl)
    }
)

//ログアウト処理 Passport 0.6 以降で req.logout() の仕様が変わった
router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
});



//ユーザー詳細->抹消
router.delete('/:id' , catchAsync(async(req ,res )=>{
    // console.log("del reviews" );
    const { id } = req.params;
    const reviews = await User.findById(id).populate('reviews');
    console.log("del reviews" , reviews);
    await User.findByIdAndDelete(id); // MongoDBから該当するユーザーを削除
    res.redirect('/users'); // 削除後にリダイレクト
   
      
}))

export default router;
