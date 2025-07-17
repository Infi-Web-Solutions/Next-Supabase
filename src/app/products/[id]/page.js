"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import '../../../app/globals.css'
export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

//   const handleBuyNow = async () => {
//   const res = await fetch("/api/payment", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ product }),
//   });

//   const result = await res.json();
//   if (result.success) {
//     window.location.href = result.url;
//   } else {
//     alert("Payment failed: " + result.error);
//   }
// };


const handleBuyNow = async () => {
  const res = await fetch("/api/payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product }),
  });

  const result = await res.json();

  if (res.status === 401) {
    // ✅ Show alert before redirecting
    Swal.fire({
      icon: "warning",
      title: "Please login first",
      text: "You need to log in before making a purchase.",
      confirmButtonText: "Go to Login",
    }).then((r) => {
      if (r.isConfirmed) {
        window.location.href = result.redirectTo || "/auth/login";
      }
    });
    return;
  }

  if (result.success) {
    window.location.href = result.url;
  } else {
    Swal.fire({
      icon: "error",
      title: "Payment Failed",
      text: result.error || "Something went wrong.",
    });
  }
};

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`/api/products/${id}`);
      const result = await res.json();
      setProduct(result.data);
    }
    fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;


  const imageUrl = product.image
    ? `/uploads/${product.image}`
    : "/placeholder.png";

  return (
    <div className="container productcont">
      <div className="row">
        <div className="col-md-6">
          <img
            src={imageUrl}
            alt={product.name}
            className="img-fluid rounded"
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p className="fw-bold text-primary">Price: ₹{product.price}</p>
          <button onClick={handleBuyNow} className="btn btn-success">Buy Now</button>
        </div>
      </div>
    </div>
  );
}
