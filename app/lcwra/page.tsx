"use client";

import { useState } from "react";
import Link from "next/link";

export default function LCWRAPage() {
  const [answers, setAnswers] = useState({
    walking: "",
    standing: "",
    coping: "",
  });

  const [result, setResult] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const checkEligibility = () => {
    let points = 0;

    if (answers.walking === "severe") points += 15;
    if (answers.standing === "severe") points += 15;
    if (answers.coping === "severe") points += 15;

    if (points >= 15) {
      setResult(
        "You may have a strong case for LCWRA / Work Capability Assessment support."
      );
    } else {
      setResult(
        "You may not meet the LCWRA threshold based on these answers."
      );
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <div style={{ marginBottom: "10px" }}>
      <Link href="/" style={linkStyle}>
        ← Back to Benefits Calculator
        </Link>
        </div>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        LCWRA Checker
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div>
          <label>Do you have severe difficulty walking?</label>
          <select
            name="walking"
            value={answers.walking}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select</option>
            <option value="none">No</option>
            <option value="severe">Yes</option>
          </select>
        </div>

        <div>
          <label>Do you struggle to sit or stand for long periods?</label>
          <select
            name="standing"
            value={answers.standing}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select</option>
            <option value="none">No</option>
            <option value="severe">Yes</option>
          </select>
        </div>

        <div>
          <label>Do you struggle to cope with daily activities safely?</label>
          <select
            name="coping"
            value={answers.coping}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Select</option>
            <option value="none">No</option>
            <option value="severe">Yes</option>
          </select>
        </div>

        <button onClick={checkEligibility} style={buttonStyle}>
          Check LCWRA
        </button>
      </div>

      {result && (
        <div style={resultBox}>
          <h2 style={{ marginTop: 0 }}>Result</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
const linkStyle: React.CSSProperties = {
  color: "#0070f3",
  fontWeight: "bold",
  textDecoration: "none",
};
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  marginTop: "5px",
  fontSize: "16px",
  boxSizing: "border-box",
};

const buttonStyle: React.CSSProperties = {
  padding: "14px",
  backgroundColor: "#0070f3",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "18px",
  cursor: "pointer",
};

const resultBox: React.CSSProperties = {
  marginTop: "24px",
  padding: "20px",
  background: "#f9fafb",
  borderRadius: "10px",
  border: "1px solid #ddd",
};