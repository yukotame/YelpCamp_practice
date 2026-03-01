import { cities } from './cities.js';
import { places , descriptors } from "./seedHelpers.js";
import  mongoose  from "mongoose";
import { Campground } from "../models/campground.js";

const dbUrl = "mongodb://localhost:27017/yelp-camp"; // データベースURLを指定
// Mongooseの接続処理
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex : true
}).then(() => {
    console.log("seedデータ作成 MongoDBに接続しました！");
}).catch(err => {
    console.error("seedデータ作成 MongoDB接続エラー:", err);
});

// データベースをクリアする関数
const clearDB = async () => {
    try {
        await Campground.deleteMany({}); // Mongoose のクエリメソッドCampgroundコレクションのデータを削除
        console.log("データベースのデータを削除しました！");
    } catch (err) {
        console.error("データ削除中にエラーが発生しました:", err);
    }
};
//配列を渡して、ランダムに値を選択
const sample = (array)=>{
    return    array[Math.floor(Math.random()* array.length)];
}

const seed = async()=>{
    for (let i =0 ; i < 10 ; i++){
        const rand = Math.floor(Math.random()*cities.length + 1)
        // console.log("rand" , rand);
        // console.log("city" , cities[i+1]);
        // console.log("place" , places[i+1]);
        // console.log("descriptor" , descriptors[i+1]);
        const price = Math.floor(Math.random()*5000 + 1000)

        const camp = new Campground({
            title:`${sample(descriptors)}・${sample(places)}`,      
            location : `${cities[rand].prefecture}${cities[rand].city}`,
            // image: `https://picsum.photos/400?random=${Math.random()}`,
            description:'ジョバンニまでなんだねえ。こいつをお持ちになったので、なんだか、泣きだしたいのを、虔んで聞いているというようにほくほくして、そっちを見あげました。ぼくはどうしてとるんですかと叫ぶようにききました。僕はあれをよく見てこころもちをしずめるんだジョバンニは、もうどこへ行ったろうカムパネルラもぼんやりそう言っていました。その小さな列車の窓は一列小さく赤く見え、その枝には熟してまっ赤になっていた。',
            price:1000,
            author:'699ad876d94e8d75087d335d',
            images:[{
                
                url: 'https://res.cloudinary.com/dfh8iiael/image/upload/v1772098204/YelpCamp/utt52bqpv4ze7docntuq.jpg',
                filename: 'YelpCamp/utt52bqpv4ze7docntuq'
            },
            {
                
                url: 'https://res.cloudinary.com/dfh8iiael/image/upload/v1772098205/YelpCamp/mkvuydtjjboosx8qbdde.jpg',
                filename: 'YelpCamp/mkvuydtjjboosx8qbdde'
            },
            {
            
                url: 'https://res.cloudinary.com/dfh8iiael/image/upload/v1772098205/YelpCamp/xnmntmdzbzemglafgltr.jpg',
                filename: 'YelpCamp/xnmntmdzbzemglafgltr'
            }]
        })
        await camp.save();
    }

}
clearDB().then(()=>{
    console.log("DB delete")
})
seed().then(()=>{
    console.log("DB create")
    mongoose.connection.close();
    console.log("DB connection close")
});