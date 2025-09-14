import { Request, Response } from "express";
import Product from "../models/product.schema";
import mongoose from "mongoose";
import Collection from "../models/collection.schema";
import { productSchema } from "../schema/product.zod";
import handler from "../services/handler";
import CustomError from "../services/customError";
import { uploadToCloudinary } from "../config/cloudinary";


export const addProduct = handler(async (req: Request, res: Response) => {
  const body = {
    ...req.body,
    price: req.body.price ? Number(req.body.price) : undefined,
    stock: req.body.stock ? Number(req.body.stock) : 0,
    ratings: req.body.ratings ? Number(req.body.ratings) : 0,
    sold: req.body.sold ? Number(req.body.sold) : 0,
  };

  let uploadedImages: { url: string; public_id: string }[] = [];
  if (req.file) {
    const result = await uploadToCloudinary(req.file.path, "products");
    uploadedImages.push({
      url: result.secure_url,
      public_id: result.public_id,
    });
    body.images = uploadedImages;
  }

  const validate = productSchema.safeParse(body);
  if (!validate.success) {
    throw new CustomError("Invalid product input", 400, validate.error.issues);
  }

  const product = await Product.create(validate.data);

  if (validate.data.collectionId) {
    await Collection.findByIdAndUpdate(validate.data.collectionId, {
      $inc: { productCount: 1 },
    });
  }

  return res.status(201).json({
    success: true,
    statusCode: 201,
    message: "Product created successfully",
    data: product,
  });
});


// exportconst addProduct = handler(async (req: Request, res: Response) => {
//   const validate = productSchema.safeParse(req.body);
//   if (!validate.success) {
//     throw new CustomError("Invalid product input", 400, validate.error.issues);
//   }

//   const { name, price, brand, description, category, stock, collectionId } = validate.data;

//  let uploadedImages: { url: string; public_id: string }[] = [];

//   if (req.file) {
//     const result = await uploadToCloudinary(req.file.path, "products");
//     uploadedImages.push({
//       url: result.secure_url,
//       public_id: result.public_id,
//     });
//   }

//   const body = {
//     ...req.body,
//     price: Number(req.body.price),
//     stock: Number(req.body.stock),
//     ratings: Number(req.body.ratings) || 0,
//     sold: Number(req.body.sold) || 0,
//   };

//   // const product = await Product.create({
//   //   name,
//   //   price,
//   //   brand,
//   //   description,
//   //   category,
//   //   stock,
//   //   collectionId,
//   // });

//   if (collectionId) {
//     await Collection.findByIdAndUpdate(collectionId, { $inc: { productCount: 1 } });
//   }

//   return res.status(201).json({
//     success: true,
//     statusCode: 201,
//     message: "Product created successfully",
//     data: Product,
//     // data: {

//     //   id: product._id,
//     //   name: product.name,
//     //   brand: product.brand,
//     //   price: product.price,
//     //   description: product.description,
//     //   category: product.category,
//     //   stock: product.stock,
//     //   collectionId: product.collectionId,
//     //   images: product.images,
//     // },
//   });
// });

export const getAllProducts = handler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;

  const productAggregate = Product.aggregate([
    { $match: { isDeleted: false } },
    { $sort: { createdAt: -1 } },
  ]);

  const products = await (Product as any).aggregatePaginate(productAggregate, {
    page: Number(page),
    limit: Number(limit),
    customLabels: {
      totalDocs: "totalProducts",
      docs: "products",
    },
  });

  return res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Products fetched successfully",
    data: products,
  });
});

export const getProductById = handler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new CustomError("Invalid Product ID", 400);
  }

  const product = await Product.findById(id).populate("collectionId");
  if (!product) throw new CustomError("Product not found", 404);

  return res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Product fetched successfully",
    data: product,
  });
});

export const updateProduct = handler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new CustomError("Invalid Product ID", 400);
  }

   const body: any = {
    ...req.body,
    price: req.body.price ? Number(req.body.price) : undefined,
    stock: req.body.stock ? Number(req.body.stock) : undefined,
    ratings: req.body.ratings ? Number(req.body.ratings) : undefined,
    sold: req.body.sold ? Number(req.body.sold) : undefined,
  };

    if (req.file) {
    const result = await uploadToCloudinary(req.file.path, "products");
    body.$push = {
      images: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    };
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!updatedProduct) throw new CustomError("Product not found", 404);

  return res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Product updated successfully",
    data: updatedProduct,
  });
});

export const productByCollectionId = handler(
  async (req: Request, res: Response) => {
    const { collectionId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(collectionId)) {
      throw new CustomError("Invalid Collection ID", 400);
    }

    const productAggregate = Product.aggregate([
      {
        $match: {
          collectionId: new mongoose.Types.ObjectId(collectionId),
          isDeleted: false,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    const products = await (Product as any).aggregatePaginate(productAggregate, {
      page: Number(page),
      limit: Number(limit),
      customLabels: {
        totalDocs: "totalProducts",
        docs: "products",
      },
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Products fetched successfully by Collection ID",
      data: products,
    });
  }
);

export const deleteProduct = handler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new CustomError("Invalid Product ID", 400);
  }

  const deletedProduct = await Product.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  if (!deletedProduct) throw new CustomError("Product not found", 404);

  if (deletedProduct.collectionId) {
    await Collection.findByIdAndUpdate(deletedProduct.collectionId, {
      $inc: { productCount: -1 },
    });
  }

  return res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Product deleted successfully",
    data: deletedProduct,
  });
});
