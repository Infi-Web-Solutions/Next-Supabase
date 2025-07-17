"use client";

import { useEffect, useState } from "react";
import ProductCard from "../../components/usercomponent/products/ProductCard";
// import AuthWrapper from "../../components/Authredirect";
import '../../app/globals.css'

export default function UserProductPage() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const productsPerPage = 6;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products/");
      const result = await res.json();
      if (result.products) {
        setProducts(result.products);
      }
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    // <AuthWrapper>
    <div className="container py-4 productcont ">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-semibold">Available Products</h2>
      </div>

      <div className="row g-4">
        {currentProducts.map((product) => (
          <div className="col-md-4" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => prev - 1)}>
                Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => prev + 1)}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    // </AuthWrapper>
  );
}
