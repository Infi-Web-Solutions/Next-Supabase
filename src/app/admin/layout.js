"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import AdminSidebar from "../../components/admincomponent/sidebar/AdminSidebar";
import AdminNavbar from "../../components/admincomponent/navbar/AdminNavbar";
import { AuthProvider, useAuth } from "../../context/AuthContext";

function InnerLayout({ children }) {
  const { isReady } = useAuth();

  if (!isReady) return null; // ⏳ Wait until localStorage is loaded

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1">
        <AdminNavbar />
        <main className="p-4 bg-light" style={{ minHeight: "100vh" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <InnerLayout>{children}</InnerLayout>
    </AuthProvider>
  );
}
