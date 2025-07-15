"use client";
import { useEffect, useState } from "react";
import PlanCard from "../../components/usercomponent/plans/PlanCard";
import Swal from "sweetalert2";

export default function PlansPage() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetch("/api/stripe/plans")
      .then((res) => res.json())
      .then((data) => setPlans(data.plans || []));
  }, []);

  // async function handleSubscribe(priceId) {
  //   const res = await fetch("/api/stripe/plans", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ priceId }),
  //   });
  //   const data = await res.json();
  //   if (data.url) window.location.href = data.url;
  // }

  const handleSubscribe = async (priceId) => {
  const res = await fetch("/api/stripe/plans", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceId }),
  });

  const result = await res.json();

  if (res.status === 401) {
    // Redirect user to login
    Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "Please login to subscribe to a plan.",
      confirmButtonText: "Login",
    }).then((r) => {
      if (r.isConfirmed) {
        window.location.href = result.redirectTo || "/auth/login";
      }
    });
    return;
  }

  if (result?.url) {
    window.location.href = result.url;
  } else {
    Swal.fire("Error", result.error || "Something went wrong", "error");
  }
};



  return (
    <div className="container mt-4">
      <h2 className="mb-3">Choose a Plan</h2>
      <div className="row">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onSubscribe={handleSubscribe} />
        ))}
      </div>
    </div>
  );
}
