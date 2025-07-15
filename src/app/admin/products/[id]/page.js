"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/components/admincomponent/products/ProductForm";

export default function UpdateProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${id}`);
      const json = await res.json();
      if (res.ok) {
        setProduct(json.data);
      } else {
        alert("Product not found");
      }
    };
    fetchProduct();
  }, [id]);

  const handleUpdate = async (form) => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
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

  if (!product) return <p>Loading...</p>;

  return <ProductForm initialData={product} onSubmit={handleUpdate} />;
}
