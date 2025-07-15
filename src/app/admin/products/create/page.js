
"use client";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/admincomponent/products/ProductForm";

export default function CreateProductPage() {
  const router = useRouter();

  const handleCreate = async (form) => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    const res = await fetch("/api/products", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Product created!");
      router.push("/admin/products");
    } else {
      alert("❌ Error: " + data.error);
    }
  };

  return <ProductForm onSubmit={handleCreate} />;
}
