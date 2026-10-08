// src/components/ProtectedAdminRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<Props> = ({ children }) => {
  const stored = sessionStorage.getItem("adminData");

  if (!stored) {
    return <Navigate to="/admin-login" replace />;
  }

  try {
    JSON.parse(stored); // validate it's parseable
  } catch {
    return <Navigate to="/admin-login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
