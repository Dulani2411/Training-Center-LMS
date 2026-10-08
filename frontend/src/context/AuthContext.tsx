// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface StudentData {
  id: number;
  email: string;
  name?: string;
  studentId?: string;
  enrolledCourse?: string;
  isPasswordChanged?: boolean;
}

export interface AdminData {
  role: "admin" | "subadmin";
  username: string;
}

export interface AuthContextType {
  studentToken: string | null;
  studentData: StudentData | null;
  adminData: AdminData | null;
  isStudentLoggedIn: boolean;
  isAdminLoggedIn: boolean;
  loginStudent: (token: string, data: StudentData, remember: boolean) => void;
  updateStudentData: (data: Partial<StudentData>) => void;
  logoutStudent: () => void;
  loginAdmin: (data: AdminData) => void;
  logoutAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [studentToken, setStudentToken] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [adminData, setAdminData] = useState<AdminData | null>(null);

  // Read persisted auth on mount
  useEffect(() => {
    const token =
      localStorage.getItem("studentToken") ||
      sessionStorage.getItem("studentToken");
    const storedStudent =
      localStorage.getItem("studentData") ||
      sessionStorage.getItem("studentData");
    if (token) setStudentToken(token);
    if (storedStudent) {
      try {
        setStudentData(JSON.parse(storedStudent));
      } catch {
        // ignore parse errors
      }
    }

    const storedAdmin = sessionStorage.getItem("adminData");
    if (storedAdmin) {
      try {
        setAdminData(JSON.parse(storedAdmin));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  const loginStudent = (token: string, data: StudentData, remember: boolean) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("studentToken", token);
    storage.setItem("studentData", JSON.stringify(data));
    setStudentToken(token);
    setStudentData(data);
  };

  const updateStudentData = (partial: Partial<StudentData>) => {
    setStudentData((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...partial };
      if (localStorage.getItem("studentData")) {
        localStorage.setItem("studentData", JSON.stringify(updated));
      }
      if (sessionStorage.getItem("studentData")) {
        sessionStorage.setItem("studentData", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const logoutStudent = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentData");
    sessionStorage.removeItem("studentToken");
    sessionStorage.removeItem("studentData");
    setStudentToken(null);
    setStudentData(null);
  };

  const loginAdmin = (data: AdminData) => {
    sessionStorage.setItem("adminData", JSON.stringify(data));
    setAdminData(data);
  };

  const logoutAdmin = () => {
    sessionStorage.removeItem("adminData");
    setAdminData(null);
  };

  return (
    <AuthContext.Provider
      value={{
        studentToken,
        studentData,
        adminData,
        isStudentLoggedIn: !!studentToken,
        isAdminLoggedIn: !!adminData,
        loginStudent,
        updateStudentData,
        logoutStudent,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
