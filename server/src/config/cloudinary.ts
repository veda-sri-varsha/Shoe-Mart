import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import config from "./index";
import fs from "fs";

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (
  filePath: string,
  folder = "shoe-mart"
): Promise<UploadApiResponse> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto",
      use_filename: true,
      unique_filename: false,
    });

    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  } finally {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Temporary file ${filePath}.`);
    }
  }
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
};


export const deleteManyFromCloudinary = async (publicIds: string[]) => {
  try {
    await Promise.all(publicIds.map((id) => cloudinary.uploader.destroy(id)));
  } catch (error) {
    console.error("Cloudinary bulk delete error:", error);
    throw error;
  }
};

export default cloudinary;
