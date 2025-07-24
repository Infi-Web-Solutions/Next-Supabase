

"use client";
import { useState, useEffect } from "react";

export default function ProductForm({ initialData = {}, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    category: "",
    image: null,
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm({
        name: initialData.name || "",
        price: initialData.price || "",
        description: initialData.description || "",
        stock: initialData.stock || "",
        category: initialData.category || "",
        image: null, 
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form); 
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-md-6">
        <label className="form-label">Product Name</label>
        <input
          type="text"
          className="form-control"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Price</label>
        <input
          type="number"
          className="form-control"
          name="price"
          value={form.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="col-md-12">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          name="description"
          rows="3"
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Stock Quantity</label>
        <input
          type="number"
          className="form-control"
          name="stock"
          value={form.stock}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Category</label>
        <input
          type="text"
          className="form-control"
          name="category"
          value={form.category}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Product Image</label>
        <input
          type="file"
          className="form-control"
          name="image"
          onChange={handleChange}
        />
        {initialData?.image && (
          <img
            src={`/uploads/${initialData.image}`}
            alt="Current"
            className="mt-2"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        )}
      </div>

      <div className="col-12">
        <button type="submit" className="btn btn-primary">
          {initialData?.id ? "Update Product" : "Save Product"}
        </button>
      </div>
    </form>
  );
}

