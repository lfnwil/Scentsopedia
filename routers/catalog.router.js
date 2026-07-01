import express from "express";
import * as CatalogController from "../controllers/catalog.controller.js";

const router = express.Router();

router.get("/brands", CatalogController.getAllBrands);
router.get("/notes", CatalogController.getAllNotes);

export default router;
