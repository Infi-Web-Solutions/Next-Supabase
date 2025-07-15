"use client";
import { useEffect, useState } from "react";
import ProductTable  from "@/components/admincomponent/products/ProductTable";

export default function AdminProductList() {
  const [product, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) setProducts(data.data);
    }
    fetchProducts();
  }, []);

  return (
    <div className="container py-4">
      <ProductTable product={product} />
    </div>
  );
}
