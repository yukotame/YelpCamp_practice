import { User } from "../models/user.js";

export const renderRegister = (req ,res )=>{
    //path: view/users/register に遷移
    res.render('users/register')
}

export const register = async(req ,res , next)=>{
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
}

export const renderLogin = (req ,res )=>{
    //path: view/users/register に遷移
    res.render('users/login')
}

export const login = async(req ,res )=>{
    req.flash('success' , 'おかえりなさい');
    const redirectUrl = res.locals.returnTo || '/campgrounds'; // ここを res.locals.returnTo に変更
    res.redirect(redirectUrl)
    }

export const logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}

export const deleteUser = async(req ,res )=>{
    // console.log("del reviews" );
    const { id } = req.params;
    const reviews = await User.findById(id).populate('reviews');
    console.log("del reviews" , reviews);
    await User.findByIdAndDelete(id); // MongoDBから該当するユーザーを削除
    res.redirect('/users'); // 削除後にリダイレクト
   
      
}