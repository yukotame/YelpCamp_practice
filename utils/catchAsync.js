export function catchAsync(fn) {
    console.log("Hello");

    return (req, res, next)=>{
            fn(req, res, next).catch(e =>  next(e))
         }        
    }


    // 1. 関数を定義しておく
// const myHandler = (req, res, next) => {
//   res.send("Hello!");
// };

// 2. 登録する場所で使う
// app.get('/hello', myHandler);