import  mongoose  from "mongoose";

const Schema = mongoose.Schema;


 const campgroundSchema = new Schema({
    title:String,
    image:String,
    price:Number,
    description:String,
    location:String,

})
// 2. SchemaからModelを作成（ここが重要！）
export const Campground = mongoose.model('Campground', campgroundSchema);