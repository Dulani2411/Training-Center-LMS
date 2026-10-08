// src/components/ProtectedStudentRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const ProtectedStudentRoute: React.FC<Props> = ({ children }) => {
  const token =
    localStorage.getItem("studentToken") ||
    sessionStorage.getItem("studentToken");

  if (!token) {
    return <Navigate to="/student" replace />;
  }

  return <>{children}</>;
};

export default ProtectedStudentRoute;
