import { Navigate, Outlet, useLocation } from "react-router";
import { getStoredToken } from "../services/api";

export function ProtectedRoute() {
  const location = useLocation();
  const token = getStoredToken();

  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}