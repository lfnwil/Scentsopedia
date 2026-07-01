import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "./config/database.js";
import { initializeFragranceMocks } from "./services/fragrance.service.js";
import { logMiddleware } from "./middlewares/log.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import catalogRouter from "./routers/catalog.router.js";
import fragranceRouter from "./routers/fragrance.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await sequelize.sync({ force: true });
await initializeFragranceMocks();

const app = express();

app.use(cors());
app.use(express.json());
app.use(logMiddleware);
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1", catalogRouter);
app.use("/api/v1", fragranceRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(errorHandler);

app.listen(3000, () => console.log("Server écoute sur http://localhost:3000"));
