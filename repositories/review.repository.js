import { Review } from "../models/index.model.js";

export async function createReview({ fragranceId, rating, comment }) {
    return await Review.create({ fragranceId, rating, comment });
}

export async function getReviewById(id) {
    return await Review.findByPk(id) || null;
}

export async function getDeletedReviewById(id) {
    return await Review.scope("deleted").findByPk(id) || null;
}

export async function updateReview(id, values) {
    const review = await getReviewById(id);
    if (!review) return null;
    return await review.update(values);
}

export async function deleteReview(id) {
    return await updateReview(id, { isDeleted: true });
}

export async function restoreReview(id) {
    const deletedReview = await getDeletedReviewById(id);
    if (!deletedReview) return null;
    return await deletedReview.update({ isDeleted: false });
}

export async function getAllReviews() {
    return await Review.findAll();
}

export async function getAllReviewsDeleted() {
    return await Review.scope("deleted").findAll();
}
