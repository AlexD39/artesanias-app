export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "EDITOR";
};

export type LoginResponse = {
  ok: boolean;
  token: string;
  user: AdminUser;
};