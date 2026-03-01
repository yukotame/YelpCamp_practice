import  mongoose  from "mongoose";
import { Review } from "./review.js";

const Schema = mongoose.Schema;

const imageSchema = new Schema({
        url:String,
        filename:String
})
imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200')
})

 const campgroundSchema = new Schema({
    title:String,
    images:[imageSchema],
    price:Number,
    description:String,
    location:String,
    author:
        {
            type:Schema.Types.ObjectId,
            ref:'User'
        },
    
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]

})

//campgroundに紐づいたReviewを削除する
campgroundSchema.post('findOneAndDelete', async function (campGround) {
    console.log("削除！！")
    if (campGround.reviews.length) {
        const res = await Review.deleteMany({ _id: { $in: campGround.reviews } });
        console.log(res);
    }
});


// 2. SchemaからModelを作成（ここが重要！）
export const Campground = mongoose.model('Campground', campgroundSchema);