"use client";

export default function PlanCard({ plan, onSubscribe }) {
  return (
    <div className="col-md-4">
      <div className="card p-3">
        <h4>{plan.name}</h4>
        <p>{plan.description}</p>
        <h5>₹{(plan.price / 100).toFixed(2)} / month</h5>

        {plan.features && plan.features.length > 0 && (
          <ul className="mt-2">
            {plan.features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        )}

        <button className="btn btn-primary mt-3" onClick={() => onSubscribe(plan.id)}>
          Subscribed
        </button>
      </div>
    </div>
  );
}
