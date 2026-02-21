import  mongoose  from "mongoose";

const Schema = mongoose.Schema;


 const reviewSchema = new Schema({
    body:String,
    rating:Number

})
// 2. SchemaからModelを作成（ここが重要！）
export const Review = mongoose.model('Review', reviewSchema);