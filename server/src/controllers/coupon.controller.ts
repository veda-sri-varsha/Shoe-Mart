import { Request, Response } from "express";
import Coupon from "../models/coupon.schema";
import { AuthRequest } from "../middlewares/UserAuth";
import handler from "../services/handler";
import CustomError from "../services/customError";

export const createCoupon = handler(async (req: Request, res: Response) => {
  const { code, discount, expiry } = req.body;

  if (!code || !discount || !expiry) {
    throw new CustomError("Please fill all fields", 400);
  }

  const coupon = await Coupon.create({ code, discount, expiry });

  res.status(201).json({
    success: true,
    message: "Coupon created successfully",
    data: coupon,
  });
});

export const getCoupons = handler(async (_req: Request, res: Response) => {
  const coupons = await Coupon.find();
  if (!coupons.length) {
    throw new CustomError("No coupons found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Coupons fetched successfully",
    data: coupons,
  });
});

export const updateCoupon = handler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { code, discount, expiry } = req.body;

  if (!code || !discount || !expiry) {
    throw new CustomError("Please fill all fields", 400);
  }

  const coupon = await Coupon.findByIdAndUpdate(
    id,
    { code, discount, expiry },
    { new: true }
  );

  if (!coupon) {
    throw new CustomError("Coupon not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Coupon updated successfully",
    data: coupon,
  });
});

export const deleteCoupon = handler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const coupon = await Coupon.findByIdAndDelete(id);

  if (!coupon) {
    throw new CustomError("Coupon not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Coupon deleted successfully",
  });
});

export const activeCoupon = handler(async (req: AuthRequest, res: Response) => {
  const { code } = req.body;

  if (!code) {
    throw new CustomError("Please provide coupon code", 400);
  }

  if (!req.user) {
    throw new CustomError("Please login to apply coupon", 401);
  }

  const coupon = await Coupon.findOne({ code });

  if (!coupon) {
    throw new CustomError("Coupon not found", 404);
  }

  const currentDate = new Date();
  const expiryDate = new Date(coupon.expiry);

  const isActive = currentDate <= expiryDate;

  res.status(200).json({
    success: true,
    message: isActive ? "Coupon is active" : "Coupon has expired",
    data: { active: isActive, coupon },
  });
});
