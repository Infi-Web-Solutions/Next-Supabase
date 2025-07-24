
"use client"
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminNavbar() {
  const [subdomain, setSubdomain] = useState("");
useEffect(() => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const parts = hostname.split(".");

    if (parts.length >= 3 && !hostname.includes("localhost")) {
      setSubdomain(parts[0]); 
    }
  }
}, []);


  const router = useRouter();
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await supabase.auth.signOut();
        localStorage.removeItem("permissions");

        await Swal.fire({
          icon: "success",
          title: "Logged out successfully",
          showConfirmButton: false,
          timer: 1500,
        });

        router.push("/auth/login");
      } catch (err) {
        console.error("Logout error:", err.message);
        Swal.fire({
          icon: "error",
          title: "Logout failed",
          text: err.message,
        });
      }
    }
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
      <div className="container-fluid d-flex justify-content-between align-items-center py-2">
        <Link href="/admin/dashboard" className="navbar-brand text-primary fw-bold fs-4 text-decoration-none m-0">
          {subdomain.charAt(0).toUpperCase() + subdomain.slice(1)}
        </Link>

        <button onClick={handleLogout} className="btn btn-outline-danger">
          Logout
        </button>
      </div>
    </nav>

  )
}
