"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const router = useRouter();
  const { setUserPermissions } = useAuth(); 

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/adminlogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Login failed");
        return;
      }


      localStorage.setItem("permissions", JSON.stringify(result.permissions));
      setUserPermissions(result.permissions); // This line throws error if useAuth is not used

      console.log("✅ Set permissions:", result.permissions);

      router.push("/admin/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="container mt-3">
        <h1 className="text-center mb-4">Login</h1>

        <div className="row justify-content-center">
          <div className="col-md-4 bg-light p-4 rounded shadow">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Password</label>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 mb-3">
                Login
              </button>

              {error && <div className="alert alert-danger">{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
