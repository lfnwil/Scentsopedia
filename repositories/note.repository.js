import { Note } from "../models/index.model.js";

export async function createNote({ name, img }) {
    return await Note.create({ name, img });
}

export async function getNoteById(id) {
    return await Note.findByPk(id) || null;
}

export async function getDeletedNoteById(id) {
    return await Note.scope("deleted").findByPk(id) || null;
}

export async function updateNote(id, values) {
    const note = await getNoteById(id);
    if (!note) return null;
    return await note.update(values);
}

export async function deleteNote(id) {
    return await updateNote(id, { isDeleted: true });
}

export async function restoreNote(id) {
    const deletedNote = await getDeletedNoteById(id);
    if (!deletedNote) return null;
    return await deletedNote.update({ isDeleted: false });
}

export async function getAllNotes() {
    return await Note.findAll();
}

export async function getAllNotesDeleted() {
    return await Note.scope("deleted").findAll();
}
