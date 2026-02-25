import express from 'express';
import { catchAsync } from "../utils/catchAsync.js"
import ExpressError from '../utils/ExpressError.js';
import { User } from "../models/user.js";
import passport from "passport";
import {storeReturnTo} from "../middleware.js"
// import { userSchema } from '../schemas.js';
import {renderRegister,register,renderLogin,login,logout,deleteUser} from "../controllers/users.js";

const router = express.Router(); 

//ユーザー登録画面表示
//ユーザー登録処理
router.route('/register')
.get(renderRegister)
.post(register )


//ログイン画面表示
//ログイン処理
router.route('/login')
.get(renderLogin )
.post(  
    storeReturnTo,
    passport.authenticate('local', { failureRedirect: '/login' , failureFlash:true }), 
    login
)

//ログアウト処理 Passport 0.6 以降で req.logout() の仕様が変わった
router.get('/logout', logout);

//ユーザー詳細->抹消
router.delete('/:id' , catchAsync(deleteUser))

export default router;
