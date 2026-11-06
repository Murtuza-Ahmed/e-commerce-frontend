// Women's Pajama Sets size guide — transcribed from the size-guide photo
// john shared (AL UCCAZ Women's Pajama Sets Size Guide). All measurements
// are in inches. Fabric: Cotton Jersey · Fit: Relaxed Fit · Breathable.

export interface SizeGuideRow {
  size: string;
  shirtLength: number;
  chest: number;
  sleeve: number;
  trouserLength: number;
  trouserWidth: number;
}

export const SIZE_GUIDE_TITLE = "AL UCCAZ Women's Pajama Sets Size Guide";

export const SIZE_GUIDE_ROWS: SizeGuideRow[] = [
  { size: "S", shirtLength: 25, chest: 19, sleeve: 6, trouserLength: 35, trouserWidth: 10.5 },
  { size: "M", shirtLength: 26.5, chest: 20, sleeve: 6, trouserLength: 36, trouserWidth: 11.5 },
  { size: "L", shirtLength: 28, chest: 21, sleeve: 6, trouserLength: 38, trouserWidth: 12.5 },
  { size: "XL", shirtLength: 30, chest: 22, sleeve: 6, trouserLength: 39, trouserWidth: 13 },
  { size: "XXL", shirtLength: 31, chest: 24, sleeve: 6, trouserLength: 40, trouserWidth: 14.5 },
];

export const SIZE_GUIDE_BADGES = ["Cotton Jersey", "Relaxed Fit", "Breathable Fabric"];

export const SIZE_GUIDE_IMAGE = "/assets/night-suits/size-guide.jpg";
