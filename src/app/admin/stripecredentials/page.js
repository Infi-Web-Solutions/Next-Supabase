'use client';

import { useState } from 'react';

export default function StripeKeyForm() {
  const [stripeKey, setStripeKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const res = await fetch('/api/stripecredentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stripe_secret_key: stripeKey }),
    });

    const data = await res.json();
    setLoading(false);
    setMessage(data.message || 'Saved');
  }

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <h2>Save Stripe Secret Key</h2>
       <form onSubmit={handleSubmit}>
        <label>Stripe Secret Key:</label>
        <input
          type="text"
          value={stripeKey}
          onChange={(e) => setStripeKey(e.target.value)}
          placeholder="sk_test_..."
          required
          style={{ width: '100%', padding: 8, marginTop: 4, marginBottom: 12 }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Saving...' : 'Save Key'}
        </button>
      </form>
      {message && <p style={{ color: 'green', marginTop: 10 }}>{message}</p>}
    </div>
  );
}
