import * as FragranceService from "../services/fragrance.service.js";

export async function getWishlist(req, res, next) {
  try {
    res.json(await FragranceService.getWishlist());
  } catch (error) {
    next(error);
  }
}

export async function getAllFragrances(req, res, next) {
  try {
    res.json(await FragranceService.getAllFragrances(req.query));
  } catch (error) {
    next(error);
  }
}

export async function getFragranceById(req, res, next) {
  try {
    res.json(await FragranceService.getFragranceById(req.params.id));
  } catch (error) {
    next(error);
  }
}

export async function createFragrance(req, res, next) {
  try {
    res.status(201).json(await FragranceService.createFragrance(req.body));
  } catch (error) {
    next(error);
  }
}

export async function updateFragrance(req, res, next) {
  try {
    res.json(await FragranceService.updateFragrance(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
}

export async function deleteFragrance(req, res, next) {
  try {
    await FragranceService.deleteFragrance(req.params.id);
    res.json({ message: "Parfum supprimé" });
  } catch (error) {
    next(error);
  }
}

export async function restoreFragrance(req, res, next) {
  try {
    res.json(await FragranceService.restoreFragrance(req.params.id));
  } catch (error) {
    next(error);
  }
}
