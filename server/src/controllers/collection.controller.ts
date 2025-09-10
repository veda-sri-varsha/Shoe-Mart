import { Request, Response } from "express";
import Collection from "../models/collection.schema";
import handler from "../services/handler";
import CustomError from "../services/customError";
import { uploadToCloudinary, deleteManyFromCloudinary } from "../config/cloudinary";


export const createCollection = handler(async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    throw new CustomError("Please provide name", 400);
  }
 
let uploadedImages: { url: string; public_id: string }[] = [];

  if (req.file) {
    const result = await uploadToCloudinary(req.file.path, "collections");
    uploadedImages.push({
      url: result.secure_url,
      public_id: result.public_id,
    });
  }

  const newCollection = await Collection.create({ name , images: uploadedImages });

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: "Collection created successfully",
    data: {
      id: newCollection._id,
      name: newCollection.name,
      isActive: newCollection.isActive,
      productCount: newCollection.productCount,
      images: newCollection.images,
    },
  });
});

export const updateCollection = handler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    throw new CustomError("Please provide name", 400);
  }

  const collection = await Collection.findById(id);
  if (!collection) {
    throw new CustomError("Collection not found", 404);
  }

  let uploadedImages: { url: string; public_id: string }[] = collection.images || [];

  if (req.file) {
    const result = await uploadToCloudinary(req.file.path, "collections");

    const oldPublicIds = uploadedImages.map((img) => img.public_id);
    if (oldPublicIds.length > 0) {
      await deleteManyFromCloudinary(oldPublicIds);
    }

    uploadedImages = [{
      url: result.secure_url,
      public_id: result.public_id,
    }];
  }

  collection.name = name;
  collection.images = uploadedImages;
  await collection.save();

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Collection updated successfully",
    data: {
      id: collection._id,
      name: collection.name,
      isActive: collection.isActive,
      productCount: collection.productCount,
      images: collection.images,
    },
  });
});

export const deleteCollection = handler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedCollection = await Collection.findByIdAndDelete(id);

  if (!deletedCollection) {
    throw new CustomError("Collection not found", 404);
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Collection deleted successfully",
    data: {
      id: deletedCollection._id,
      name: deletedCollection.name,
      isActive: deletedCollection.isActive,
    },
  });
});

export const getAllCollections = handler(async (req: Request, res: Response) => {
  const collections = await Collection.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "All collections fetched successfully",
    count: collections.length,
    data: collections.map((col) => ({
      id: col._id,
      name: col.name,
      isActive: col.isActive,
      productCount: col.productCount,
      images: col.images,
      createdAt: col.createdAt,
      updatedAt: col.updatedAt,
    })),
  });
});
