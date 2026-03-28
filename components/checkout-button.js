"use client";

import { useState, useTransition } from "react";

export default function CheckoutButton({ productId }) {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleCheckout() {
    startTransition(async () => {
      setError("");

      try {
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ productId })
        });

        const payload = await response.json();

        if (!response.ok || !payload.url) {
          throw new Error(payload.error || "Checkout failed.");
        }

        window.location.href = payload.url;
      } catch (checkoutError) {
        setError(checkoutError.message);
      }
    });
  }

  return (
    <div className="checkout-wrap">
      <button
        type="button"
        className="button button-primary checkout-button"
        onClick={handleCheckout}
        disabled={isPending}
      >
        {isPending ? "Starting Checkout..." : "Buy With Stripe"}
      </button>
      {error ? <p className="checkout-error">{error}</p> : null}
    </div>
  );
}
