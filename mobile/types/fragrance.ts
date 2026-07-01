export type FragranceBrand = {
  id?: number;
  name?: string | null;
  img?: string | null;
};

export type Fragrance = {
  id: number | string;
  name: string;
  Brand?: FragranceBrand | null;
  brandName?: string | null;
  concentration?: string | null;
  formatMl?: number | null;
  mainStatus?: string | null;
  olfactoryFamilies?: string[] | null;
};
