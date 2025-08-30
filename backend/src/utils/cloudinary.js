import { v2 as cloudinary } from "cloudinary"
import fs from "fs"



cloudinary.config({
    api_key: process.env.API_KEY,
    cloud_name: process.env.CLOUD_NAME,
    api_secret: process.env.API_SECRET
});

const uploadOnCloudinary = async function (filePath) {
    try {
        if (!filePath) return null;
        const response = await cloudinary.uploader.upload(filePath, { resource_type: "auto", secure: true });
        console.log("File is uploaded");
        fs.unlinkSync(filePath);
        return response;
    } catch (error) {
        fs.unlinkSync(filePath);
        return null;
    }
}

export default uploadOnCloudinary