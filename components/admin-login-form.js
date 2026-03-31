"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [allowBlankLocalLogin, setAllowBlankLocalLogin] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;
    setAllowBlankLocalLogin(
      host === "localhost" || host === "127.0.0.1" || host === "::1"
    );
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setError(payload.error || "Sign-in failed.");
        setPending(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Sign-in failed.");
      setPending(false);
      return;
    }

    setPending(false);
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <label className="admin-field">
        <span>Email</span>
        <input
          type="email"
          name="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required={!allowBlankLocalLogin}
        />
      </label>
      <label className="admin-field">
        <span>Password</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required={!allowBlankLocalLogin}
        />
      </label>
      {error ? <p className="admin-error">{error}</p> : null}
      <button type="submit" className="admin-button" disabled={pending}>
        {pending ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
