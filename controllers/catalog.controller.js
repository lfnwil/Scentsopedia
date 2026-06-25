import { Brand, Note } from "../models/index.model.js";

export async function getAllBrands(req, res, next) {
  try {
    res.json(await Brand.findAll({ where: { isDeleted: false } }));
  } catch (error) {
    next(error);
  }
}

export async function getAllNotes(req, res, next) {
  try {
    res.json(await Note.findAll({ where: { isDeleted: false } }));
  } catch (error) {
    next(error);
  }
}
