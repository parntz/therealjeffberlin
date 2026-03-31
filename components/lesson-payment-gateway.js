"use client";

import { useMemo, useState } from "react";
import EditableGroup from "./editable-group";
import EditableTextClient from "./editable-text-client";
import { LESSON_PRICE, makePaypalLink } from "../lib/site-data";

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 10;
const ITEM_NAME = "Jeff Berlin Private Bass Lesson";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export default function LessonPaymentGateway({
  isAdminSignedIn = false,
  copy = {}
}) {
  const [quantity, setQuantity] = useState(1);

  const total = quantity * LESSON_PRICE;
  const paypalHref = useMemo(
    () =>
      makePaypalLink(ITEM_NAME, LESSON_PRICE.toFixed(2), {
        quantity: String(quantity)
      }),
    [quantity]
  );

  function updateQuantity(nextQuantity) {
    const safeQuantity = Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, nextQuantity));
    setQuantity(safeQuantity);
  }

  return (
    <section className="lesson-payment-panel" aria-label="Lesson payment">
      <div className="lesson-payment-header">
        <EditableGroup
          title="Lessons — payment panel"
          isAdminSignedIn={isAdminSignedIn}
          className="lesson-payment-editable"
        >
          <EditableTextClient
            contentId="lessons.payment.eyebrow"
            initialValue={copy.eyebrow || "Pay Online"}
            as="p"
            className="eyebrow"
            rows={2}
            isAdminSignedIn={isAdminSignedIn}
            editLabel="Eyebrow"
          />
          <EditableTextClient
            contentId="lessons.payment.title"
            initialValue={copy.title || "Lock in one lesson or stack a few at once."}
            as="h3"
            rows={3}
            isAdminSignedIn={isAdminSignedIn}
            editLabel="Title"
          />
          <EditableTextClient
            contentId="lessons.payment.body"
            initialValue={
              copy.body ||
              `Each lesson is ${formatCurrency(LESSON_PRICE)}. Choose the quantity and jump straight to PayPal.`
            }
            as="p"
            rows={4}
            isAdminSignedIn={isAdminSignedIn}
            editLabel="Body"
          />
        </EditableGroup>
      </div>

      <div className="lesson-payment-pricing">
        <div>
          <span>Per lesson</span>
          <strong>{formatCurrency(LESSON_PRICE)}</strong>
        </div>
        <div>
          <span>Total</span>
          <strong>{formatCurrency(total)}</strong>
        </div>
      </div>

      <div className="lesson-payment-controls">
        <span className="lesson-payment-label">How many lessons?</span>
        <div className="lesson-quantity-picker">
          <button
            type="button"
            className="lesson-quantity-button"
            onClick={() => updateQuantity(quantity - 1)}
            disabled={quantity === MIN_QUANTITY}
            aria-label="Decrease lesson quantity"
          >
            -
          </button>
          <input
            className="lesson-quantity-input"
            type="number"
            min={MIN_QUANTITY}
            max={MAX_QUANTITY}
            value={quantity}
            onChange={(event) => updateQuantity(Number(event.target.value) || MIN_QUANTITY)}
            aria-label="Lesson quantity"
          />
          <button
            type="button"
            className="lesson-quantity-button"
            onClick={() => updateQuantity(quantity + 1)}
            disabled={quantity === MAX_QUANTITY}
            aria-label="Increase lesson quantity"
          >
            +
          </button>
        </div>
      </div>

      <a
        href={paypalHref}
        target="_blank"
        rel="noreferrer"
        className="button button-primary lesson-payment-button"
      >
        Pay {formatCurrency(total)} With PayPal
      </a>

      <p className="lesson-payment-note">
        PayPal opens in a new tab and calculates the charge from the quantity
        you selected.
      </p>
    </section>
  );
}
