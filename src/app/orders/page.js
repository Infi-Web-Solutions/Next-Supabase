"use client";
import { useEffect, useState } from "react";
import OrderTable from "@/components/usercomponent/order/UserOrder";

export default function AdminOrderList() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const contentType = res.headers.get("content-type");

        if (!res.ok) {
          const result = contentType?.includes("application/json") ? await res.json() : {};
          throw new Error(result.error || "Failed to fetch orders");
        }

        if (contentType?.includes("application/json")) {
          const result = await res.json();
          setOrders(result.orders || []);
        } else {
          throw new Error("Invalid response format from server");
        }
      } catch (err) {
        setError(err.message || "Unexpected error occurred");
      }
    };

    fetchOrders();
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="mb-4">Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <OrderTable orders={orders} />
      )}
    </div>
  );
}
