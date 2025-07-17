"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import styles from "./AdminSidebar.module.css"
import { useAuth } from "../../../context/AuthContext"

export default function AdminSidebar() {
  const pathname = usePathname();
  const isActive = (href) => pathname.startsWith(href);
  const [showDropdown, setShowDropdown] = useState(false);

  const { userPermissions , isReady} = useAuth();
  // console.log("Sidebar all permissions:", userPermissions); 

 if (!isReady) return null;

  return (
    <div className={styles.sidebar}>
      <nav className="nav flex-column mt-5">

        <Link href="/admin/dashboard" className={`${styles.link} ${isActive("/admin/dashboard") ? styles.active : ""}`}>
          Dashboard
        </Link>

        {/* ✅ Show Product section if user has any product-related permission */}
        {userPermissions.some(p => p.startsWith("products:")) && (
          <>
            <span
              onClick={() => setShowDropdown(!showDropdown)}
              className={`${styles.link} ${isActive("/admin/products") ? styles.active : ""}`}
              style={{ cursor: "pointer" }}
            >
              Product Manager {showDropdown ? "▲" : "▼"}
            </span>

            {showDropdown && (
              <div className="ps-3">
                {userPermissions.includes("products:view") && (
                  <Link
                    href="/admin/products"
                    className={`${styles.link} ${isActive("/admin/products") ? styles.active : ""}`}
                  >
                    Product List
                  </Link>
                )}
                {userPermissions.includes("products:create") && (
                  <Link
                    href="/admin/products/create"
                    className={`${styles.link} ${isActive("/admin/products/create") ? styles.active : ""}`}
                  >
                    Create Product
                  </Link>
                )}
              </div>
            )}
          </>
        )}

        {/* ✅ Only show if user has order viewing permission */}
        {userPermissions.includes("orders:view") && (
          <Link
            href="/admin/orders"
            className={`${styles.link} ${isActive("/admin/orders") ? styles.active : ""}`}
          >
            Order Manager
          </Link>
        )}

        {/* ✅ Only show system user management to those with permission */}
        {userPermissions.includes("systemusers:view") && (
          <Link
            href="/admin/systemuser"
            className={`${styles.link} ${isActive("/admin/systemuser") ? styles.active : ""}`}
          >
            System User
          </Link>
        )}

      </nav>
    </div>
  )
}


