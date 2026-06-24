import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { sequelize, Brand, Fragrance, Note } from "./models/index.model.js";
import { brandsMocks } from "./mocks/brands.mock.js";
import { fragrancesMocks } from "./mocks/fragrances.mock.js";
import { notesMocks } from "./mocks/notes.mock.js";
import { logMiddleware } from "./middlewares/log.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await sequelize.sync({ force: true });

for (const brand of brandsMocks) {
  await Brand.findOrCreate({ where: { name: brand.name }, defaults: brand });
}

for (const note of notesMocks) {
  await Note.findOrCreate({ where: { name: note.name }, defaults: note });
}

const normalizeSeason = (season) => (season === "Été" ? "Eté" : season);
const normalizeNoteName = (name) => (name === "Canelle" ? "Cannelle" : name);

for (const fragrance of fragrancesMocks) {
  const brand = await Brand.findOne({ where: { name: fragrance.brandName } });
  const topNote = await Note.findOne({ where: { name: normalizeNoteName(fragrance.topNoteName) } });
  const heartNote = await Note.findOne({ where: { name: normalizeNoteName(fragrance.heartNoteName) } });
  const baseNote = await Note.findOne({ where: { name: normalizeNoteName(fragrance.baseNoteName) } });

  await Fragrance.findOrCreate({
    where: { name: fragrance.name },
    defaults: {
      name: fragrance.name,
      brandId: brand?.id,
      price: fragrance.price,
      genre: fragrance.genre,
      description: fragrance.description,
      img: fragrance.img,
      topNoteId: topNote?.id,
      heartNoteId: heartNote?.id,
      baseNoteId: baseNote?.id,
      accords: fragrance.accords,
      saison: normalizeSeason(fragrance.saison),
    },
  });
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(logMiddleware);
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/v1/brands", async (req, res, next) => {
  try {
    res.json(await Brand.findAll());
  } catch (error) {
    next(error);
  }
});

app.get("/api/v1/notes", async (req, res, next) => {
  try {
    res.json(await Note.findAll());
  } catch (error) {
    next(error);
  }
});

app.get("/api/v1/fragrances", async (req, res, next) => {
  try {
    const fragrances = await Fragrance.findAll({
      include: [
        Brand,
        { model: Note, as: "topNote" },
        { model: Note, as: "heartNote" },
        { model: Note, as: "baseNote" },
      ],
    });

    res.json(fragrances);
  } catch (error) {
    next(error);
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(errorHandler);

app.listen(3000, () => console.log("Server écoute sur http://localhost:3000"));
