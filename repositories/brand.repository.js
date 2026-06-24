import { Brand } from "../models/index.model.js";

export async function createBrand({ name, img }) {
    return await Brand.create({ name, img });
}

export async function getBrandById(id) {
    return await Brand.findByPk(id) || null;
}

export async function getDeletedBrandById(id) {
    return await Brand.scope("deleted").findByPk(id) || null;
}

export async function updateBrand(id, values) {
    const brand = await getBrandById(id);
    if (!brand) return null;
    return await brand.update(values);
}

export async function deleteBrand(id) {
    return await updateBrand(id, { isDeleted: true });
}

export async function restoreBrand(id) {
    const deletedBrand = await getDeletedBrandById(id);
    if (!deletedBrand) return null;
    return await deletedBrand.update({ isDeleted: false });
}

export async function getAllBrands() {
    return await Brand.findAll();
}

export async function getAllBrandsDeleted() {
    return await Brand.scope("deleted").findAll();
}
