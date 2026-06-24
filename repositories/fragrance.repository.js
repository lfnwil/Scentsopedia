import { Fragrance } from "../models/index.model.js";

export async function createFragrance({ name, img }) {
    return await Fragrance.create({ name, img });
}

export async function getFragranceById(id) {
    return await Fragrance.findByPk(id) || null;
}

export async function getDeletedFragranceById(id) {
    return await Fragrance.scope("deleted").findByPk(id) || null;
}

export async function updateFragrance(id, values) {
    const fragrance = await getFragranceById(id);
    if (!fragrance) return null;
    return await fragrance.update(values);
}

export async function deleteFragrance(id) {
    return await updateFragrance(id, { isDeleted: true });
}

export async function restoreFragrance(id) {
    const deletedFragrance = await getDeletedFragranceById(id);
    if (!deletedFragrance) return null;
    return await deletedFragrance.update({ isDeleted: false });
}

export async function getAllFragrances() {
    return await Fragrance.findAll();
}

export async function getAllFragrancesDeleted() {
    return await Fragrance.scope("deleted").findAll();
}
