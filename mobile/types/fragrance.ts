export type FragranceBrand = {
  id?: number;
  name?: string | null;
  img?: string | null;
};

export type FragranceNote = {
  id?: number;
  name?: string | null;
  img?: string | null;
};

export type FragranceEvolution = {
  opening?: string | null;
  after30min?: string | null;
  drydown?: string | null;
};

export type Fragrance = {
  id: number | string;
  name: string;
  brandId?: number | null;
  Brand?: FragranceBrand | null;
  brandName?: string | null;
  perfumer?: string | null;
  inspiration?: string | null;
  concentration?: string | null;
  price?: number | null;
  description?: string | null;
  imageUri?: string | null;
  img?: string | null;
  accords?: string | null;
  saison?: string | null;
  formatMl?: number | null;
  size?: string | null;
  pricePer100ml?: number | null;
  rating?: number | null;
  sillage?: string | null;
  longevity?: string | null;
  evolution?: FragranceEvolution | null;
  personalNotes?: string | null;
  mainStatus?: string | null;
  olfactoryFamilies?: string[] | null;
  notes?: string[] | null;
  topNotes?: string[] | null;
  heartNotes?: string[] | null;
  baseNotes?: string[] | null;
  seasons?: string[] | null;
  occasions?: string[] | null;
  isFavorite?: boolean | null;
  isWishlist?: boolean | null;
  wishlistPriority?: string | null;
  productUrl?: string | null;
  shop?: string | null;
  discoveredAt?: string | null;
  testedOn?: string | null;
  topNote?: FragranceNote | null;
  heartNote?: FragranceNote | null;
  baseNote?: FragranceNote | null;
};
