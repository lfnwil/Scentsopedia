import * as CatalogService from "../services/catalog.service.js";

export async function getAllBrands(req, res, next) {
  try {
    res.json(await CatalogService.getAllBrands());
  } catch (error) {
    next(error);
  }
}

export async function getAllNotes(req, res, next) {
  try {
    res.json(await CatalogService.getAllNotes());
  } catch (error) {
    next(error);
  }
}
