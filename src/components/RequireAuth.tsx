import { Outlet, Navigate, useLocation } from "react-router-dom";
import { getToken } from "@/lib/auth";

export default function RequireAuth() {
  const location = useLocation();
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
