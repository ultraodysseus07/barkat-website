import raw from "../data/products.json";
export type Product = {
  id: string;
  type: "wax" | "vessel" | "scent" | "hamper";
  name: string;
  price: number;
  mrp?: number;
  slug?: string;
  family?: string;
  mood?: string;
  notes?: string[];
  story?: string;
  line?: string;
  desc?: string;
  color?: string;
  bg?: string;
  material?: string;
  finish?: string;
  includes?: string[];
  image?: string;
  samplePricing?: boolean;
  sampleProduct?: boolean;
};
export function validateCatalog(value: unknown): asserts value is Product[] {
  if (!Array.isArray(value)) throw new Error("Catalog must be an array");
  const ids = new Set(),
    slugs = new Set();
  for (const p of value) {
    if (
      !p ||
      typeof p.id !== "string" ||
      ids.has(p.id) ||
      !p.name ||
      !["wax", "vessel", "scent", "hamper"].includes(p.type) ||
      !Number.isSafeInteger(p.price) ||
      p.price <= 0
    )
      throw new Error("Invalid product");
    ids.add(p.id);
    if (
      p.mrp !== undefined &&
      (!Number.isSafeInteger(p.mrp) || p.mrp < p.price)
    )
      throw new Error("Invalid MRP");
    if (p.slug) {
      if (!/^[a-z0-9-]+$/.test(p.slug) || slugs.has(p.slug))
        throw new Error("Invalid slug");
      slugs.add(p.slug);
    }
    if (p.type === "scent" && !p.slug) throw new Error("Missing scent slug");
    if (
      p.type === "hamper" &&
      (!Array.isArray(p.includes) ||
        !p.includes.length ||
        p.includes.some((s: unknown) => typeof s !== "string" || !s.trim()))
    )
      throw new Error("Missing hamper contents");
  }
}
validateCatalog(raw);
export const products: Product[] = raw;
export const money = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
export const discount = (p: Pick<Product, "price" | "mrp">) =>
  p.mrp && p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0;
export const productUrl = (p: Product) =>
  p.slug
    ? "/fragrances/" + p.slug + "/"
    : p.type === "hamper"
      ? "/gifting/"
      : p.type === "vessel"
        ? "/vessels/#" + p.id
        : "/#catalogue";
