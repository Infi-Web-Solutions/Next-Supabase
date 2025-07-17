"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabase/client";
import styles from "./UserNavbar.module.css";
import { FaUserCircle } from "react-icons/fa";

export default function UserNavbar() {
  const [features, setFeatures] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [userPlan, setUserPlan] = useState("Free");


  // useEffect(() => {
  //   const fetchFeatures = async () => {
  //     try {
  //       const res = await fetch("/api/subscribe", { cache: "no-store" });
  //       const result = await res.json();
  //       if (result.success) {
  //         setFeatures(result.data.features);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching features:", err);
  //     }
  //   };

  //   fetchFeatures();
  // }, []);


  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const res = await fetch("/api/subscribe", { cache: "no-store" });
        const result = await res.json();
        if (result.success) {
          setFeatures(result.data.features);
          setUserPlan(result.data.planName || "Free");
        }
      } catch (err) {
        console.error("Error fetching features:", err);
      }
    };

    const checkAuthStatus = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      setIsLoggedIn(!!user);
      if (user) {
        setUserEmail(user.email);  // ✅ Set user email
      }
    };

    fetchFeatures();
    checkAuthStatus();
  }, []);



  const handleUpgradeAlert = () => {
    Swal.fire({
      icon: "info",
      title: "Upgrade Required",
      text: "This feature is available only on higher plans. Please upgrade.",
      confirmButtonText: "Upgrade Now",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/plan");
      }
    });
  };

  function hasFeature(name) {
    return features?.some((f) => f.name === name && f.enabled);
  }


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

        router.push("/");
        setIsLoggedIn(false); // <-- Set false after logout
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
    <div className={`container-fluid ${styles["nav-wrapper"]}`}>
      <div className="container">
        <nav className={styles.navbar}>
          <Link href="/" className={styles["navbar-brand"]}>
            QuickKart
          </Link>

          {/* ✅ NEW wrapper for nav links + dropdown */}
          <div className={styles["nav-right"]}>
            <div className={styles["nav-links"]}>
              <Link href="/" className={`${styles.link} mt-0 btn btn-link`}>Home</Link>

              <Link href="/products" className={`${styles.link} mt-0 btn btn-link`}>Products</Link>

              {hasFeature("my order") ? (
                <Link href="/orders" className={styles.link}>My Orders</Link>
              ) : (
                <button onClick={handleUpgradeAlert} className={`${styles.link} mt-0 btn btn-link`}>My Orders</button>
              )}

              {hasFeature("document") ? (
                <Link href="/document" className={styles.link}>Document</Link>
              ) : (
                <button onClick={handleUpgradeAlert} className={`${styles.link} btn btn-link`}>Document</button>
              )}

              {hasFeature("learning") ? (
                <Link href="/learning" className={styles.link}>Learning</Link>
              ) : (
                <button onClick={handleUpgradeAlert} className={`${styles.link} btn btn-link`}>Learning</button>
              )}
            </div>

            {/* Profile icon dropdown */}
            <div className={styles.dropdown}>
              <button className={styles["profile-btn"]} onClick={() => setShowMenu(!showMenu)}>
                <FaUserCircle size={24} />
              </button>

              {showMenu && (
                <div className={styles["dropdown-menu"]}>
                  {userEmail && (
                    <div className={styles["dropdown-item"]}>
                      <strong>{userEmail}</strong>
                      <br />
                      <small>Plan: {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}</small>
                    </div>
                  )}

                  <Link href="/plan" className={styles["dropdown-item"]}>Upgrade Plan</Link>

                  {!isLoggedIn ? (
                    <Link href="/auth/login" className={styles["dropdown-item"]}>Login</Link>
                  ) : (
                    <button onClick={handleLogout} className={styles["dropdown-item"]}>Logout</button>
                  )}
                </div>
              )}

            </div>
          </div>
        </nav>

      </div>
    </div>
  );
}

