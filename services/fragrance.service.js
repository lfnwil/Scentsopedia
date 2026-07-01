import { Brand, Fragrance, Note } from "../models/index.model.js";
import { brandsMocks } from "../mocks/brands.mock.js";
import { fragrancesMocks } from "../mocks/fragrances.mock.js";
import { notesMocks } from "../mocks/notes.mock.js";
import { NotFoundError } from "../errors/api.error.js";

const fragranceInclude = [
  Brand,
  { model: Note, as: "topNote" },
  { model: Note, as: "heartNote" },
  { model: Note, as: "baseNote" },
];

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const normalizeSeason = (season) => (season === "Été" ? "Eté" : season);
const normalizeNoteName = (name) => (name === "Canelle" ? "Cannelle" : name);
const unique = (values) => [...new Set(values.filter(Boolean))];

function cleanString(value) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function toList(value) {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) return value.map(cleanString).filter(Boolean);
  if (typeof value === "string") {
    return value.split(",").map(cleanString).filter(Boolean);
  }

  return [value].filter(Boolean);
}

function normalizeNoteList(value) {
  return toList(value).map(normalizeNoteName);
}

function normalizeSeasonList(value) {
  return toList(value).map(normalizeSeason);
}

function toBoolean(value) {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return Boolean(value);
}

function toNumber(value) {
  if (value === undefined || value === null || value === "") return value;
  const number = Number(value);
  return Number.isNaN(number) ? undefined : number;
}

function parseFormatMl(value) {
  if (value === undefined || value === null || value === "") return value;
  if (typeof value === "number") return value > 0 ? value : undefined;

  const match = String(value).replace(",", ".").match(/\d+(\.\d+)?/);
  if (!match) return undefined;

  const number = Number(match[0]);
  return number > 0 ? number : undefined;
}

function calculatePricePer100ml(price, formatMl) {
  if (price === undefined || price === null || formatMl === undefined || formatMl === null) {
    return null;
  }

  if (formatMl <= 0) return null;

  return Math.round((price / formatMl) * 100 * 100) / 100;
}

function stripUndefined(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined)
  );
}

async function findOrCreateBrand(name) {
  const cleanName = cleanString(name);
  if (!cleanName) return null;

  const [brand] = await Brand.findOrCreate({
    where: { name: cleanName },
    defaults: { name: cleanName },
  });

  return brand;
}

async function findOrCreateNote(name) {
  const cleanName = cleanString(normalizeNoteName(name));
  if (!cleanName) return null;

  const [note] = await Note.findOrCreate({
    where: { name: cleanName },
    defaults: { name: cleanName },
  });

  return note;
}

async function firstNoteId(noteNames) {
  const firstName = noteNames[0];
  if (!firstName) return undefined;

  const note = await findOrCreateNote(firstName);
  return note?.id;
}

function getListField(input, fieldName, fallbackName, normalizer = toList) {
  if (hasOwn(input, fieldName)) return normalizer(input[fieldName]);
  if (fallbackName && hasOwn(input, fallbackName)) return normalizer(input[fallbackName]);
  return undefined;
}

function getEvolution(input) {
  if (hasOwn(input, "evolution")) return input.evolution ?? {};

  const evolution = stripUndefined({
    opening: input.evolutionOpening,
    after30min: input.evolutionAfter30min,
    drydown: input.evolutionDrydown,
  });

  return Object.keys(evolution).length > 0 ? evolution : undefined;
}

async function buildFragrancePayload(input, { partial = false, currentFragrance = null } = {}) {
  const brandName = input.brandName ?? input.house;
  const brand = input.brandId ? null : await findOrCreateBrand(brandName);

  const topNotes = getListField(input, "topNotes", "topNoteName", normalizeNoteList);
  const heartNotes = getListField(input, "heartNotes", "heartNoteName", normalizeNoteList);
  const baseNotes = getListField(input, "baseNotes", "baseNoteName", normalizeNoteList);
  const notes = getListField(input, "notes", null, normalizeNoteList);
  const seasons = getListField(input, "seasons", "saison", normalizeSeasonList);
  const hasPrice = hasOwn(input, "price");
  const hasFormat = hasOwn(input, "formatMl") || hasOwn(input, "format") || hasOwn(input, "size");
  const price = hasPrice ? toNumber(input.price) : undefined;
  const formatMl = hasOwn(input, "formatMl")
    ? parseFormatMl(input.formatMl)
    : hasOwn(input, "format")
      ? parseFormatMl(input.format)
      : hasOwn(input, "size")
        ? parseFormatMl(input.size)
        : undefined;
  const effectivePrice = hasPrice ? price : currentFragrance?.price;
  const effectiveFormatMl = hasFormat ? formatMl : currentFragrance?.formatMl;
  const shouldCalculatePricePer100ml = !partial
    || hasPrice
    || hasFormat;

  const computedNotes = unique([
    ...(notes ?? []),
    ...(topNotes ?? []),
    ...(heartNotes ?? []),
    ...(baseNotes ?? []),
  ]);

  await Promise.all(computedNotes.map(findOrCreateNote));

  const payload = {
    name: hasOwn(input, "name") || !partial ? cleanString(input.name) ?? "Parfum sans nom" : undefined,
    brandId: input.brandId ?? brand?.id,
    perfumer: input.perfumer,
    inspiration: input.inspiration,
    concentration: input.concentration,
    price,
    description: input.description,
    img: input.img ?? input.imageUri,
    imageUri: input.imageUri ?? input.img,
    topNoteId: input.topNoteId ?? (topNotes ? await firstNoteId(topNotes) : undefined),
    heartNoteId: input.heartNoteId ?? (heartNotes ? await firstNoteId(heartNotes) : undefined),
    baseNoteId: input.baseNoteId ?? (baseNotes ? await firstNoteId(baseNotes) : undefined),
    accords: input.accords,
    genre: input.genre,
    saison: hasOwn(input, "saison") ? normalizeSeason(input.saison) : seasons?.[0],
    olfactoryFamilies: getListField(input, "olfactoryFamilies", "olfactoryFamily"),
    notes: computedNotes.length > 0 ? computedNotes : notes,
    topNotes,
    heartNotes,
    baseNotes,
    seasons,
    occasions: getListField(input, "occasions", "occasion"),
    rating: toNumber(input.rating),
    sillage: input.sillage,
    longevity: input.longevity,
    evolution: getEvolution(input),
    personalNotes: input.personalNotes,
    mainStatus: input.mainStatus,
    isFavorite: toBoolean(input.isFavorite),
    isWishlist: toBoolean(input.isWishlist),
    wishlistPriority: input.wishlistPriority,
    productUrl: input.productUrl,
    shop: input.shop,
    discoveredAt: input.discoveredAt,
    testedOn: input.testedOn,
    size: input.size,
    formatMl,
    pricePer100ml: shouldCalculatePricePer100ml
      ? calculatePricePer100ml(effectivePrice, effectiveFormatMl)
      : undefined,
  };

  return stripUndefined(payload);
}

async function findFragranceOrFail(id) {
  const fragrance = await Fragrance.findByPk(id, { include: fragranceInclude });

  if (!fragrance || fragrance.isDeleted) {
    throw new NotFoundError("Parfum introuvable");
  }

  return fragrance;
}

function filterFragrances(fragrances, query) {
  const search = cleanString(query.q)?.toLowerCase();
  const family = cleanString(query.family);
  const season = cleanString(query.season);
  const status = cleanString(query.status);
  const wishlist = toBoolean(query.wishlist);
  const favorite = toBoolean(query.favorite);

  return fragrances.filter((fragrance) => {
    const perfume = fragrance.toJSON();
    const searchableText = [
      perfume.name,
      perfume.Brand?.name,
      ...(perfume.notes ?? []),
      ...(perfume.olfactoryFamilies ?? []),
    ].join(" ").toLowerCase();

    if (search && !searchableText.includes(search)) return false;
    if (family && !(perfume.olfactoryFamilies ?? []).includes(family)) return false;
    if (season && !(perfume.seasons ?? []).includes(normalizeSeason(season))) return false;
    if (status && perfume.mainStatus !== status) return false;
    if (wishlist !== undefined && perfume.isWishlist !== wishlist) return false;
    if (favorite !== undefined && perfume.isFavorite !== favorite) return false;

    return true;
  });
}

export async function initializeFragranceMocks() {
  for (const brand of brandsMocks) {
    await Brand.findOrCreate({ where: { name: brand.name }, defaults: brand });
  }

  for (const note of notesMocks) {
    await Note.findOrCreate({ where: { name: note.name }, defaults: note });
  }

  for (const fragrance of fragrancesMocks) {
    await Fragrance.create(await buildFragrancePayload(fragrance));
  }
}

export async function getWishlist() {
  return await Fragrance.findAll({
    where: { isWishlist: true, isDeleted: false },
    include: fragranceInclude,
  });
}

export async function getAllFragrances(query = {}) {
  const fragrances = await Fragrance.findAll({
    where: { isDeleted: false },
    include: fragranceInclude,
  });

  return filterFragrances(fragrances, query);
}

export async function getFragranceById(id) {
  return await findFragranceOrFail(id);
}

export async function createFragrance(values) {
  const fragrance = await Fragrance.create(await buildFragrancePayload(values));
  return await findFragranceOrFail(fragrance.id);
}

export async function updateFragrance(id, values) {
  const fragrance = await findFragranceOrFail(id);
  await fragrance.update(await buildFragrancePayload(values, {
    partial: true,
    currentFragrance: fragrance,
  }));

  return await findFragranceOrFail(fragrance.id);
}

export async function deleteFragrance(id) {
  const fragrance = await findFragranceOrFail(id);
  await fragrance.update({ isDeleted: true });
}

export async function restoreFragrance(id) {
  const fragrance = await Fragrance.findByPk(id);

  if (!fragrance) {
    throw new NotFoundError("Parfum introuvable");
  }

  await fragrance.update({ isDeleted: false });
  return await findFragranceOrFail(fragrance.id);
}
