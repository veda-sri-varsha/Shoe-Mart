import { z } from "zod";
import AuthRoles from "../constants/authRoles";
import rateLimit from "express-rate-limit";
import CustomError from "../services/customError";

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z
    .email("Invalid email format")
    .transform((val) => val.toLowerCase()),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(AuthRoles).default(AuthRoles.USER),
});

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  handler: (_req, _res, next) => {
    next(new CustomError(
      "Too many signup attempts. Please try again later.",
      429
    ));
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  handler: (_req, _res, next) => {
    next(new CustomError(
      "Too many login attempts. Please try again later.",
      429
    ));
  },
  standardHeaders: true,
  legacyHeaders: false,
});
