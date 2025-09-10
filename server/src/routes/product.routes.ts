import { Router } from "express";
import {
  getAllProducts,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  productByCollectionId,
} from "../controllers/product.controller";
import UserAuth, { authorize } from "../middlewares/UserAuth";
import AuthRoles from "../constants/authRoles";
import { upload } from "../middlewares/upload.middleware";


const router: Router = Router();

router.post("/", UserAuth,upload.single("image"), authorize(AuthRoles.ADMIN, AuthRoles.VENDOR), addProduct);
router.put(
  "/:id",
  UserAuth,
  authorize(AuthRoles.ADMIN, AuthRoles.VENDOR),
  updateProduct
);
router.patch(
  "/:id",
  UserAuth,
  authorize(AuthRoles.ADMIN, AuthRoles.VENDOR),
  deleteProduct
);
router.get(
  "/",
  UserAuth,
  getAllProducts
);
router.get(
  "/:id",
  UserAuth,
  authorize(AuthRoles.ADMIN, AuthRoles.VENDOR),
  getProductById
);
router.get(
  "/collection/:id",
  UserAuth,
  authorize(AuthRoles.ADMIN, AuthRoles.VENDOR),
  productByCollectionId
);

export default router;
