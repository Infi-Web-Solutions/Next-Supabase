// "use client";
// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import ProductForm from "@/components/admincomponent/products/ProductForm";

// export default function UpdateProductPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       const res = await fetch(`/api/products/${id}`);
//       const json = await res.json();
//       if (res.ok) {
//         setProduct(json.data);
//       } else {
//         alert("Product not found");
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   const handleUpdate = async (form) => {
//     const formData = new FormData();
//     Object.entries(form).forEach(([key, value]) => {
//       if (value) formData.append(key, value);
//     });

//     const res = await fetch(`/api/products/${id}`, {
//       method: "PUT",
//       body: formData,
//     });

//     const data = await res.json();
//     if (res.ok) {
//       alert("✅ Product updated!");
//       router.push("/admin/products");
//     } else {
//       alert("❌ Error: " + data.error);
//     }
//   };

//   if (!product) return <p>Loading...</p>;

//   return <ProductForm initialData={product} onSubmit={handleUpdate} />;
// }


"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/components/admincomponent/products/ProductForm";

export default function UpdateProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [isAllowed, setIsAllowed] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false); // 👈 Prevents early render

  useEffect(() => {
    const checkPermissions = () => {
      try {
        const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
        if (perms.includes("products:update")) {
          setIsAllowed(true);
        } else {
          router.replace("/admin/unauthorized"); // 🚫 Redirect if no access
        }
      } catch (e) {
        console.error("Error checking permissions:", e);
        router.replace("/admin/unauthorized");
      } finally {
        setCheckedAuth(true); // ✅ Now safe to render
      }
    };

    checkPermissions();
  }, [router]);

  useEffect(() => {
    if (!isAllowed) return;
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${id}`);
      const json = await res.json();

      if (res.ok) {
        setProduct(json.data);
      } else {
        alert("❌ Product not found");
      }
    };

    fetchProduct();
  }, [id, isAllowed]);

  if (!checkedAuth) return <p>Checking access...</p>; // ⏳ wait until auth check done
  if (!isAllowed) return null; // 🚫 don't flash the form before redirect
  if (!product) return <p>Loading product...</p>;

  const handleUpdate = async (form) => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Product updated!");
      router.push("/admin/products");
    } else {
      alert("❌ Error: " + data.error);
    }
  };

  return <ProductForm initialData={product} onSubmit={handleUpdate} />;
}
