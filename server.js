import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "./config/database.js";
import * as CatalogController from "./controllers/catalog.controller.js";
import * as FragranceController from "./controllers/fragrance.controller.js";
import { logMiddleware } from "./middlewares/log.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await sequelize.sync({ force: true });
await FragranceController.initializeFragranceMocks();

const app = express();

app.use(cors());
app.use(express.json());
app.use(logMiddleware);
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/v1/brands", CatalogController.getAllBrands);
app.get("/api/v1/notes", CatalogController.getAllNotes);
app.get("/api/v1/wishlist", FragranceController.getWishlist);

app.get("/api/v1/fragrances", FragranceController.getAllFragrances);
app.get("/api/v1/fragrances/:id", FragranceController.getFragranceById);
app.post("/api/v1/fragrances", FragranceController.createFragrance);
app.put("/api/v1/fragrances/:id", FragranceController.updateFragrance);
app.delete("/api/v1/fragrances/:id", FragranceController.deleteFragrance);
app.patch("/api/v1/fragrances/:id/restore", FragranceController.restoreFragrance);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(errorHandler);

app.listen(3000, () => console.log("Server écoute sur http://localhost:3000"));
