"use client";

import Link from "next/link";
import BenefitsCalculator from "./components/BenefitsCalculator";

export default function Home() {
  return (
    <main style={{ padding: 20 }}>
      <BenefitsCalculator />

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Link href="/lcwra" style={linkStyle}>
          Go to LCWRA Checker →
        </Link>
      </div>
    </main>
  );
}

const linkStyle = {
  color: "#0070f3",
  fontWeight: "bold",
  textDecoration: "none",
  fontSize: "16px",
};