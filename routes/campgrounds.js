import express from 'express';
import { catchAsync } from "../utils/catchAsync.js"

import { isLoggedIn , validateCampGround, isAuthor} from '../middleware.js';
import {index, renderNewForm, showCampground ,createCampground, renderEditForm , updateCampground , deleteCampground } from "../controllers/campgrounds.js";
import multer  from 'multer';
import {storage} from '../cloudinary/index.js'
const router = express.Router(); 

// const upload = multer({ dest: 'uploads/' });
//cloudinaryへの保存
const upload = multer({ storage });

//１．キャンプ場一覧の表示　
// req クライアント（ブラウザ）から送られてきた情報が全部入っている箱
// resサーバーからブラウザへ返すための箱
//３．キャンプ場登録処理
router.route('/')
.get(catchAsync(index))
.post(isLoggedIn,  upload.array('image_form'), validateCampGround,catchAsync(createCampground))

//upload.single アップロードファイル1枚
//upload.array  アップロードファイル複数
//test用ロジック
// .post(upload.array('image_form'),(req, res)=>{
//     console.log("req.body" ,req.body , req.file , req.files);
    
//     res.send("受付ました！" );
// })


//２．キャンプ場登録画面の表示
router.get('/new' , isLoggedIn, renderNewForm)

//４．キャンプ場編集画面表示
//５．キャンプ場詳細->抹消
//７．キャンプ場編集処理
router.route('/:id')
.get(catchAsync(showCampground))
.delete(isLoggedIn, isAuthor , catchAsync(deleteCampground))
.put(isLoggedIn, isAuthor , upload.array('image_form') ,  validateCampGround , catchAsync(updateCampground))

//６．キャンプ場ページの表示
router.get('/:id/edit' , isAuthor ,  catchAsync(renderEditForm))



export default router;
