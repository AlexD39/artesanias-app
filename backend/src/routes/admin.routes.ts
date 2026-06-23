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
import {
  adminCreateSocialLink,
  adminDeleteSocialLink,
  adminGetSettings,
  adminGetSocialLinks,
  adminUpdateSettings,
  adminUpdateSocialLink,
} from "../controllers/admin-settings.controller";


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

router.get("/settings", adminGetSettings);
router.put("/settings", adminUpdateSettings);

router.get("/social-links", adminGetSocialLinks);
router.post("/social-links", adminCreateSocialLink);
router.put("/social-links/:id", adminUpdateSocialLink);
router.delete("/social-links/:id", adminDeleteSocialLink);

export default router;