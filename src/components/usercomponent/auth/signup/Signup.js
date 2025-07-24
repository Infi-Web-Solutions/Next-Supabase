'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../../lib/supabase/client' // ✅ Correct import for Next 15 App Router
import { useEffect } from 'react'

export default function SignUpPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    contact: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [organizationId, setOrganizationId] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    const getOrgId = async () => {
      const subdomain = window.location.hostname.split('.')[0];

      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', subdomain)
        .single();

      if (orgError || !orgData) {
        setError('Organization not found');
        return;
      }

      setOrganizationId(orgData.id);
    };

    getOrgId();
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { name, email, contact, password } = form;

    // Get subdomain (like "quickmart")
    const subdomain = window.location.hostname.split('.')[0];

    // Fetch organization ID based on subdomain
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', subdomain)
      .single();


    if (orgError || !orgData) {
      setError('Organization not found');
      return;
    }

    const organization_id = orgData.id;

    // Create Supabase Auth User
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          contact,
          organization_id,
        },
      }

    });

    // console.log("data of signup user", infrom)

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // // Also save to your own 'users' table (optional but recommended)
    await supabase.from('users').insert({
      name,
      email,
      contact,
      organization_id,
      auth_id: data.user?.id,
    });

    setSuccess('Account created! Please verify your email.');
    setForm({ name: '', email: '', contact: '', password: '' });
  };


  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow-sm p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Create Account</h2>

        <form onSubmit={handleSignUp}>
          <div className="mb-3">
            <label>Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className="form-control" required />
          </div>
          <div className="mb-3">
            <label>Email address</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" required />
          </div>
          <div className="mb-3">
            <label>Contact</label>
            <input type="text" name="contact" value={form.contact} onChange={handleChange} className="form-control" required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Sign Up</button>

          {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
          {success && <div className="alert alert-success mt-3 mb-0">{success}</div>}
        </form>
      </div>
    </div>
  )
}
