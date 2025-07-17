"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import Swal from "sweetalert2";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password } = form;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      return;
    }

     await supabase.auth.refreshSession();

    // ✅ Get role from JWT
    const session = await supabase.auth.getSession();
    console.log("checking session ",session)

    //we can check to cosole the jwt 
  //   if (session?.data?.session) {
  // const jwt = session.data.session.access_token;

  // // Decode JWT to see claims
  // const base64Payload = jwt.split(".")[1];
  // const decodedPayload = JSON.parse(atob(base64Payload));

  // console.log("✅ Decoded JWT Payload:", decodedPayload);


    const role_id = session.data.session?.user.user_metadata?.role;

   console.log("role_id", role_id);

    // ✅ Fetch permissions if staff/admin
    let permissions = [];

    if (role_id === 1 || role_id === 2) {
      const { data: perms, error: permError } = await supabase
        .from("role_permissions")
        .select("permission:permission_id(module, action)")
        .eq("role_id", role_id);

      permissions = perms?.map(p => `${p.permission.module}:${p.permission.action}`) || [];
      localStorage.setItem("permissions", JSON.stringify(permissions));
    }

    // ✅ Redirect
    if (role_id === 1) {
      router.push("/admin/dashboard");
    } else if (role_id === 2) {
      router.push("/admin/dashboard");
    } else {
      router.push("/");
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "/" },
    });

    if (error) setError(error.message);
  };

  const handleGithubLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: "/" },
    });

    if (error) setError(error.message);
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="container mt-3">
        <h1 className="text-center mb-4">Login</h1>
        <div className="row justify-content-center">
          <div className="col-md-4 bg-light p-4 rounded shadow">
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
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
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 mb-3">
                Login
              </button>
               <Link
                className="d-block text-center text-decoration-none"
                href="/auth/signup"
              >
                Don’t have an account? Register
              </Link>
              <br></br>
            </form>
         

            <button
              type="button"
              className="btn btn-outline-dark w-100 mb-2"
              onClick={handleGoogleLogin}
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                width="20"
                className="me-2"
              />
              Sign in with Google
            </button>

            <button
              type="button"
              className="btn btn-outline-dark w-100"
              onClick={handleGithubLogin}
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                alt="GitHub"
                width="20"
                className="me-2"
              />
              Sign in with GitHub
            </button>

            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
