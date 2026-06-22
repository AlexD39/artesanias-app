import type { Category, Product } from "../types/product";
import type { AdminUser, LoginResponse } from "../types/auth";
import type { StoreSettings, SocialLink } from "../types/settings";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("No se pudieron cargar los productos");
  }

  const data = await response.json();
  return data.products || [];
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${slug}`);

  if (!response.ok) {
    throw new Error("Producto no encontrado");
  }

  const data = await response.json();
  return data.product;
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories`);

  if (!response.ok) {
    throw new Error("No se pudieron cargar las categorías");
  }

  const data = await response.json();
  return data.categories || [];
}
export async function loginAdmin(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo iniciar sesión");
  }

  return data;
}

export function getStoredToken() {
  return localStorage.getItem("admin_token");
}

export function getStoredUser(): AdminUser | null {
  const rawUser = localStorage.getItem("admin_user");

  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AdminUser;
  } catch {
    return null;
  }
}

export function saveSession(token: string, user: AdminUser) {
  localStorage.setItem("admin_token", token);
  localStorage.setItem("admin_user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
}

export async function getAdminProducts(): Promise<Product[]> {
  const token = getStoredToken();

  const response = await fetch(`${API_URL}/admin/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudieron cargar los productos admin");
  }

  return data.products || [];
}
export type AdminProductPayload = {
  name: string;
  shortDescription: string;
  longDescription?: string;
  price: number;
  stock: number;
  categoryId: number;
  mainImage?: string;
  status: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
  featured: boolean;
};

export async function createAdminProduct(payload: AdminProductPayload) {
  const token = getStoredToken();

  const response = await fetch(`${API_URL}/admin/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo crear el producto");
  }

  return data.product;
}

export async function updateAdminProduct(
  id: number,
  payload: AdminProductPayload
) {
  const token = getStoredToken();

  const response = await fetch(`${API_URL}/admin/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo actualizar el producto");
  }

  return data.product;
}

export async function deleteAdminProduct(id: number) {
  const token = getStoredToken();

  const response = await fetch(`${API_URL}/admin/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo desactivar el producto");
  }

  return data;
}

export async function uploadAdminProductImage(file: File): Promise<string> {
  const token = getStoredToken();

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_URL}/admin/uploads/product-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo subir la imagen");
  }

  return data.image.url;
}
export type AdminCategoryPayload = {
  name: string;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
};

export async function getAdminCategories() {
  const token = getStoredToken();

  const response = await fetch(`${API_URL}/admin/categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudieron cargar las categorías");
  }

  return data.categories || [];
}

export async function createAdminCategory(payload: AdminCategoryPayload) {
  const token = getStoredToken();

  const response = await fetch(`${API_URL}/admin/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo crear la categoría");
  }

  return data.category;
}

export async function updateAdminCategory(
  id: number,
  payload: AdminCategoryPayload
) {
  const token = getStoredToken();

  const response = await fetch(`${API_URL}/admin/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo actualizar la categoría");
  }

  return data.category;
}

export async function deleteAdminCategory(id: number) {
  const token = getStoredToken();

  const response = await fetch(`${API_URL}/admin/categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo desactivar la categoría");
  }

  return data;
}
export type StoreSettingsPayload = {
  storeName: string;
  whatsappNumber?: string;
  contactEmail?: string;
  address?: string;
  whatsappMessage?: string;
};

export type SocialLinkPayload = {
  name: string;
  url: string;
  icon?: string;
  status: "ACTIVE" | "INACTIVE";
  order: number;
};

export async function getPublicSettings(): Promise<StoreSettings> {
  const response = await fetch(`${API_URL}/settings`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo cargar la configuración");
  }

  return data.settings;
}

export async function getPublicSocialLinks(): Promise<SocialLink[]> {
  const response = await fetch(`${API_URL}/settings/social-links`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudieron cargar las redes sociales");
  }

  return data.socialLinks || [];
}

export async function getAdminSettings(): Promise<StoreSettings> {
  const token = getStoredToken();

  const response = await fetch(`${API_URL}/admin/settings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo cargar la configuración");
  }

  return data.settings;
}

export async function updateAdminSettings(payload: StoreSettingsPayload) {
  const token = getStoredToken();

  const response = await fetch(`${API_URL}/admin/settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo actualizar la configuración");
  }

  return data.settings;
}

export async function getAdminSocialLinks(): Promise<SocialLink[]> {
  const token = getStoredToken();

  const response = await fetch(`${API_URL}/admin/social-links`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudieron cargar las redes sociales");
  }

  return data.socialLinks || [];
}

export async function createAdminSocialLink(payload: SocialLinkPayload) {
  const token = getStoredToken();

  const response = await fetch(`${API_URL}/admin/social-links`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo crear la red social");
  }

  return data.socialLink;
}

export async function updateAdminSocialLink(
  id: number,
  payload: SocialLinkPayload
) {
  const token = getStoredToken();

  const response = await fetch(`${API_URL}/admin/social-links/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo actualizar la red social");
  }

  return data.socialLink;
}

export async function deleteAdminSocialLink(id: number) {
  const token = getStoredToken();

  const response = await fetch(`${API_URL}/admin/social-links/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "No se pudo desactivar la red social");
  }

  return data;
}
