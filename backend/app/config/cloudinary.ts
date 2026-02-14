import { v2 as cloudinary } from "cloudinary";
import config from "./config";
import { logger } from "./logger";
import fs from "fs"

if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });

  logger.info("Cloudinary configured successfully");
} else {
  logger.warn("Cloudinary credentials not provided. Cloudinary features will be disabled.");
}

export default cloudinary;




export const uploadOnCloudinary = async (localFilePath:string) => {
try {
if (!localFilePath) return null
//upload the file on cloudinary
const response = await cloudinary.uploader.upload
(localFilePath, {
resource_type: "auto"
})
// file has been uploaded successfull
console. log("file is uploaded on cloudinary ",response.url);
fs.unlinkSync(localFilePath)
return response;
}
catch (error){
fs.unlinkSync(localFilePath)
// remove thelocally saved temporary file as the upload operation got failed
return null
}
}