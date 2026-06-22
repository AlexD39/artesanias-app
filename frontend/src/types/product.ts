export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  status: "ACTIVE" | "INACTIVE";
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription?: string | null;
  price: number;
  stock: number;
  mainImage?: string | null;
  status: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
  featured: boolean;
  categoryId: number;
  category: Category;
};