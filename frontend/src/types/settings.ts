export type StoreSettings = {
  id: number;
  storeName: string;
  whatsappNumber?: string | null;
  contactEmail?: string | null;
  address?: string | null;
  whatsappMessage?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SocialLink = {
  id: number;
  name: string;
  url: string;
  icon?: string | null;
  status: "ACTIVE" | "INACTIVE";
  order: number;
  createdAt: string;
  updatedAt: string;
};