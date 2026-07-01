import { Brand, Note } from "../models/index.model.js";

export async function getAllBrands() {
  return await Brand.findAll({ where: { isDeleted: false } });
}

export async function getAllNotes() {
  return await Note.findAll({ where: { isDeleted: false } });
}
