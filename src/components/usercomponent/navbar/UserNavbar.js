// "use client"

// import Link from "next/link"
// import styles from "./UserNavbar.module.css"
// import Swal from "sweetalert2";

// export default function UserNavbar() {



//     const handleUpgradeAlert = () => {
//     Swal.fire({
//       icon: "info",
//       title: "Upgrade Required",
//       text: "This feature is available only on higher plans. Please upgrade.",
//       confirmButtonText: "Upgrade Now",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         router.push("/plan");
//       }
//     });
//   };


//   function hasFeature(name) {
//     return features.some((f) => f.name === name && f.enabled);
//   }


//   return (
//     <div className="container-fluid">
//       <nav className={styles.navbar}>
//         <Link href="/" className={styles["navbar-brand"]}>
//           PracticeShop
//         </Link>

//         <div className={styles["nav-links"]}>
//           <Link href="/" className={styles.link}>
//             Home
//           </Link>
//           <Link href="/products" className={styles.link}>
//             Products
//           </Link>
//           <li className="nav-item">
//             {hasFeature("my order") ? (
//               <Link className="nav-link" href="/orders">My Orders</Link>
//             ) : (
//               <button onClick={handleUpgradeAlert} className="nav-link btn btn-link text-white" style={{ textDecoration: "none" }}>
//                 My Orders
//               </button>
//             )}
//           </li>
//           <Link href="/plan" className={styles.link}>
//             upgrade palns
//           </Link>

//           <li className="nav-item">
//             {hasFeature("document") ? (
//               <Link className="nav-link" href="/document">Document</Link>
//             ) : (
//               <button onClick={handleUpgradeAlert} className="nav-link btn btn-link text-white" style={{ textDecoration: "none" }}>
//                 Document
//               </button>
//             )}
//           </li>
//           <li className="nav-item">
//             {hasFeature("learning") ? (
//               <Link className="nav-link" href="/learning">Learning</Link>
//             ) : (
//               <button onClick={handleUpgradeAlert} className="nav-link btn btn-link text-white" style={{ textDecoration: "none" }}>
//                 Learning
//               </button>
//             )}
//           </li>
//         </div>
//       </nav>
//     </div>
//   )
// }


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabase/client";
import styles from "./UserNavbar.module.css";

export default function UserNavbar() {
  const [features, setFeatures] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const res = await fetch("/api/subscribe", { cache: "no-store" });
        const result = await res.json();
        if (result.success) {
          setFeatures(result.data.features);
        }
      } catch (err) {
        console.error("Error fetching features:", err);
      }
    };

    fetchFeatures();
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
    <div className="container-fluid bg-dark conta1">
      <div className="container">
        <nav className={styles.navbar}>
          <Link href="/" className={styles["navbar-brand"]}>
            PracticeShop
          </Link>

          <div className={styles["nav-links"]}>
            <Link href="/" className={`${styles.link} mt-0  btn btn-link`}>
              Home
            </Link>

            <div>
              <Link href="/products" className={`${styles.link} mt-0  btn btn-link`}>
                Products
              </Link>
            </div>

            <div>
              {hasFeature("my order") ? (
                <Link className={styles.link} href="/orders">My Orders</Link>
              ) : (
                <button onClick={handleUpgradeAlert} className={`${styles.link} mt-0  btn btn-link`} style={{ textDecoration: "none" }}>
                  My Orders
                </button>
              )}
            </div>

            <Link href="/plan" className={`${styles.link} mt-0  btn btn-link`}>
              Upgrade Plans
            </Link>

            <div>
              {hasFeature("document") ? (
                <Link className={styles.link} href="/document">Document</Link>
              ) : (
                <button onClick={handleUpgradeAlert} className={`${styles.link} btn btn-link`} >
                  Document
                </button>
              )}
            </div>

            <div>
              {hasFeature("learning") ? (
                <Link className={styles.link} href="/learning">Learning</Link>
              ) : (
                <button onClick={handleUpgradeAlert} className={`${styles.link} btn btn-link`} >
                  Learning
                </button>
              )}
            </div>
              <Link href="/auth/login" className={`${styles.link} mt-0  btn btn-link`}>
          Login
            </Link>


            <button onClick={handleLogout} className={`${styles.link} btn btn-link p-0`}>Logout</button>



          </div>
        </nav>
      </div>
    </div>
  );
}

