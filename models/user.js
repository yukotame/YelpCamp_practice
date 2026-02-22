
import  mongoose  from "mongoose";

import pkg from "passport-local-mongoose";
const passportLocalMongoose = pkg.default;
const Schema = mongoose.Schema;


 const userSchema = new Schema({
email:{
    type:String,
    required:true,
    unique:true
}

})

//★userSchemaにpassportLocalMongooseが組み込まれる
//username,hash,saltも組み込まれる、メソッドもつかえるようになる。
//optionを変更して、errorメッセージを日本語にする
userSchema.plugin(passportLocalMongoose, {
    errorMessages: {
        UserExistsError: 'そのユーザー名はすでに使われています。',
        MissingPasswordError: 'パスワードを入力してください。',
        AttemptTooSoonError: 'アカウントがロックされてます。時間をあけて再度試してください。',
        TooManyAttemptsError: 'ログインの失敗が続いたため、アカウントをロックしました。',
        NoSaltValueStoredError: '認証ができませんでした。',
        IncorrectPasswordError: 'パスワードまたはユーザー名が間違っています。',
        IncorrectUsernameError: 'パスワードまたはユーザー名が間違っています。',
    }
});


export const User = mongoose.model('User', userSchema);