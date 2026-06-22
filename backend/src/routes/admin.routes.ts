import { Router } from "express";
import { requireAdmin, requireAuth } from "../middlewares/auth.middleware";
import {
  adminCreateProduct,
  adminDeleteProduct,
  adminGetProducts,
  adminUpdateProduct,
} from "../controllers/admin-products.controller";
import {
  adminCreateCategory,
  adminDeleteCategory,
  adminGetCategories,
  adminUpdateCategory,
} from "../controllers/admin-categories.controller";
import { adminUploadProductImage } from "../controllers/admin-upload.controller";
import { uploadProductImage } from "../middlewares/upload.middleware";

const router = Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get("/products", adminGetProducts);
router.post("/products", adminCreateProduct);
router.put("/products/:id", adminUpdateProduct);
router.delete("/products/:id", adminDeleteProduct);
router.post(
  "/uploads/product-image",
  uploadProductImage.single("image"),
  adminUploadProductImage
);
router.get("/categories", adminGetCategories);
router.post("/categories", adminCreateCategory);
router.put("/categories/:id", adminUpdateCategory);
router.delete("/categories/:id", adminDeleteCategory);


export default router;