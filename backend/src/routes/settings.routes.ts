import { Router } from "express";
import {
  getPublicSettings,
  getPublicSocialLinks,
} from "../controllers/settings.controller";

const router = Router();

router.get("/", getPublicSettings);
router.get("/social-links", getPublicSocialLinks);

export default router;