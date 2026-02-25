import express from 'express';
import { catchAsync } from "../utils/catchAsync.js"

import { isLoggedIn , validateCampGround, isAuthor} from '../middleware.js';
import {index, renderNewForm, showCampground ,createCampground, renderEditForm , updateCampground , deleteCampground } from "../controllers/campgrounds.js";

const router = express.Router(); 


//１．キャンプ場一覧の表示　
// req クライアント（ブラウザ）から送られてきた情報が全部入っている箱
// resサーバーからブラウザへ返すための箱
//３．キャンプ場登録処理
router.route('/')
.get(catchAsync(index))
.post(isLoggedIn, validateCampGround,  catchAsync(createCampground))


//２．キャンプ場登録画面の表示
router.get('/new' , isLoggedIn, renderNewForm)

//４．キャンプ場編集画面表示
//５．キャンプ場詳細->抹消
//６．キャンプ場詳細ページの表示
router.route('/:id')
.get(catchAsync(showCampground))
.delete(isLoggedIn, isAuthor , catchAsync(deleteCampground))
.put(isLoggedIn, isAuthor , validateCampGround , catchAsync(updateCampground))

//７．キャンプ場編集処理
router.get('/:id/edit' , isAuthor ,  catchAsync(renderEditForm))



export default router;
