"use client";

import { useState } from "react";

export default function HelpPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);

      const res = await fetch("/api/lead", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.details || data?.error || "Could not send request");
      }

      window.location.href = "/thank-you";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        background: "#ffffff",
        padding: "32px",
        borderRadius: "20px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
      }}
    >
      <h1 style={{ marginTop: 0, color: "#111827" }}>Get Help With Your Claim</h1>

      <p style={{ color: "#4b5563", marginBottom: "24px" }}>
        If you want help with a new claim, review, or appeal, send your details and we will contact you.
      </p>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full name" required style={inputStyle} />
        <input name="email" type="email" placeholder="Email address" required style={inputStyle} />
        <input name="phone" placeholder="Phone number" required style={inputStyle} />
        <input name="postcode" placeholder="Postcode" style={inputStyle} />

        <select name="type" style={inputStyle} defaultValue="New claim">
          <option>New claim</option>
          <option>Review / increase</option>
          <option>Appeal decision</option>
          <option>General help</option>
        </select>

        <textarea
          name="message"
          placeholder="Briefly tell us what help you need"
          rows={5}
          style={textAreaStyle}
        />

        {error ? (
          <div
            style={{
              marginBottom: "14px",
              padding: "12px",
              borderRadius: "10px",
              background: "#fff4f4",
              border: "1px solid #f1b0b7",
              color: "#8a1c1c",
            }}
          >
            {error}
          </div>
        ) : null}

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Sending..." : "Request Help"}
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  marginBottom: "14px",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "16px",
  boxSizing: "border-box",
};

const textAreaStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  marginBottom: "14px",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "16px",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  background: "#16a34a",
  color: "#ffffff",
  border: "none",
  borderRadius: "10px",
  fontWeight: 700,
  fontSize: "18px",
  cursor: "pointer",
};