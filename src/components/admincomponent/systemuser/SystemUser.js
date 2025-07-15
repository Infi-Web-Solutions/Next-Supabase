"use client";

import { useState } from "react";

export default function Createusers() {
 
 const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/systemuser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = await res.json();

    if (result.success) {
      setMessage("✅ System user created successfully.");
      setForm({
        name: "",
        email: "",
        contact: "",
        password: "",
        role: "",
      });
    } else {
      setMessage("❌ Error: " + (result.error || "Something went wrong"));
    }

    setLoading(false);
  };

  return (
    <div className="container d-flex justify-content-center mt-2">
      <div className="w-100" style={{ maxWidth: "500px" }}>
        <h3 className="text-center mb-4">System User</h3>
        {message && (
          <div className="alert alert-info text-center" role="alert">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              name="name"
              type="text"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter a name"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter an email"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contact</label>
            <input
              name="contact"
              type="text"
              className="form-control"
              value={form.contact}
              onChange={handleChange}
              placeholder="Enter a contact number"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter a password"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              name="role"
              className="form-control"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
