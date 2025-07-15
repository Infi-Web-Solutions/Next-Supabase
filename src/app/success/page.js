"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("Saving order...");

  useEffect(() => {
    if (sessionId) {
      fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            setStatus("✅ Order saved successfully!");
          } else {
            setStatus("❌ Failed to save order: " + result.error);
          }
        });
    }
  }, [sessionId]);

  return <div className="p-4 text-center">{status}</div>;
}
