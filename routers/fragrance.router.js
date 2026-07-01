import express from "express";
import * as FragranceController from "../controllers/fragrance.controller.js";

const router = express.Router();

router.get("/wishlist", FragranceController.getWishlist);

router.get("/fragrances", FragranceController.getAllFragrances);
router.get("/fragrances/:id", FragranceController.getFragranceById);
router.post("/fragrances", FragranceController.createFragrance);
router.put("/fragrances/:id", FragranceController.updateFragrance);
router.delete("/fragrances/:id", FragranceController.deleteFragrance);
router.patch("/fragrances/:id/restore", FragranceController.restoreFragrance);

export default router;
