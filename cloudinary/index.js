import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary接続テスト
// cloudinary.api.ping()
//   .then(result => console.log("Cloudinary接続成功:", result))
//   .catch(err => console.error("Cloudinary接続エラー:", err));

export const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: "YelpCamp",
		allowed_formats: ["jpeg", "png", "jpg"]
	}
});

export { cloudinary };
