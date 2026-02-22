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

export const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}