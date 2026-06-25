import { Brand, Fragrance, Note } from "../models/index.model.js";

const fragranceInclude = [
    Brand,
    { model: Note, as: "topNote" },
    { model: Note, as: "heartNote" },
    { model: Note, as: "baseNote" },
];

export async function createFragrance(values) {
    return await Fragrance.create(values);
}

export async function getFragranceById(id) {
    return await Fragrance.findByPk(id, { include: fragranceInclude }) || null;
}

export async function getDeletedFragranceById(id) {
    return await Fragrance.findOne({
        where: { id, isDeleted: true },
        include: fragranceInclude,
    }) || null;
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
    return await Fragrance.findAll({
        where: { isDeleted: false },
        include: fragranceInclude,
    });
}

export async function getAllFragrancesDeleted() {
    return await Fragrance.findAll({
        where: { isDeleted: true },
        include: fragranceInclude,
    });
}
