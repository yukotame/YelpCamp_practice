import  mongoose  from "mongoose";
import { Review } from "./review.js";

const opts = { toJSON: { virtuals: true } };
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
    geometry: {
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
    },
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

}, opts); // ←ここのoptsを追加

// ↓↓↓ここを追加
campgroundSchema.virtual('properties.popupMarkup').get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`
});
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