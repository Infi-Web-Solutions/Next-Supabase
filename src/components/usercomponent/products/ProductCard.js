"use client";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
  const router = useRouter();
  const handleOrderClick = () => {
    router.push(`/products/${product.id}`);
  };



  const imageUrl = product.image
    ? `/uploads/${product.image}`
    : "/placeholder.png";

  return (
    <div className="card h-100 shadow-sm">
      <img
        src={imageUrl}
        className="card-img-top"
        alt={product.name}
        style={{ height: "200px", objectFit: "cover" }}
      />

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">
          {product.description?.split(" ").slice(0, 6).join(" ")}...
        </p>

        <p className="card-text fw-bold text-primary">₹{product.price}</p>

        <button className="btn btn-primary w-100" onClick={handleOrderClick} >
          Order Now
        </button>
      </div>
    </div>
  );
}
