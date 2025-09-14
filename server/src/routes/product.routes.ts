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

<<<<<<< HEAD
router.post("/", UserAuth, authorize(AuthRoles.ADMIN, AuthRoles.VENDOR),upload.single("image") ,addProduct);
=======
router.post("/", UserAuth,upload.single("image"), authorize(AuthRoles.ADMIN, AuthRoles.VENDOR), addProduct);
>>>>>>> 119a0f2facd3a85e0e1480b1421ea7b96fb32c14
router.put(
  "/:id",
  UserAuth,
  authorize(AuthRoles.ADMIN, AuthRoles.VENDOR),upload.single("image"),
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
