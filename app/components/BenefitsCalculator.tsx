"use client";

import { useState } from "react";

type CalcResult = {
  uc?: string;
  breakdown?: {
    standard: number;
    children: number;
    rent: number;
    disability: number;
    deduction: string;
    workAllowance?: number;
    tariffIncome?: string;
  };
  error?: string;
  details?: string;
};

type FormState = {
  age: string;
  income: string;
  partnerIncome: string;
  children: string;
  rent: string;
  hasDisability: string;
  capital: string;
  hasHousingElement: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export default function BenefitsCalculator() {
  const [form, setForm] = useState<FormState>({
    age: "",
    income: "",
    partnerIncome: "",
    children: "",
    rent: "",
    hasDisability: "no",
    capital: "",
    hasHousingElement: "yes",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<CalcResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const next = { ...form, [e.target.name]: e.target.value };
    setForm(next);
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!form.age.trim()) nextErrors.age = "Please enter age";
    if (!form.income.trim()) nextErrors.income = "Please enter your monthly income";
    if (!form.partnerIncome.trim()) nextErrors.partnerIncome = "Enter 0 if none";
    if (!form.children.trim()) nextErrors.children = "Enter 0 if none";
    if (!form.rent.trim()) nextErrors.rent = "Enter 0 if none";

    if (form.age && Number(form.age) < 16) nextErrors.age = "Age must be 16 or over";
    if (form.income && Number(form.income) < 0) nextErrors.income = "Income cannot be negative";
    if (form.partnerIncome && Number(form.partnerIncome) < 0) nextErrors.partnerIncome = "Income cannot be negative";
    if (form.children && Number(form.children) < 0) nextErrors.children = "Children cannot be negative";
    if (form.rent && Number(form.rent) < 0) nextErrors.rent = "Rent cannot be negative";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const calculate = async () => {
    if (!validate()) {
      setResult(null);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setResult(data);
      fetch("/api/track", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    event_type: "calculator_used",
    payload: {
      age: form.age,
      children: form.children,
      hasDisability: form.hasDisability,
      capital: form.capital,
      hasHousingElement: form.hasHousingElement,
    },
  }),
}).catch(() => {
  // ignore analytics errors
});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Benefits Calculator</h1>

      <div style={formGrid}>
        <Field label="Age" error={errors.age}>
          <input
            name="age"
            type="number"
            value={form.age}
            onChange={handleChange}
            style={inputStyle}
          />
        </Field>

        <Field label="Your monthly income (£)" error={errors.income}>
          <input
            name="income"
            type="number"
            value={form.income}
            onChange={handleChange}
            style={inputStyle}
          />
        </Field>

        <Field label="Partner monthly income (£)" error={errors.partnerIncome}>
          <input
            name="partnerIncome"
            type="number"
            value={form.partnerIncome}
            onChange={handleChange}
            style={inputStyle}
          />
        </Field>

        <Field label="Number of children" error={errors.children}>
          <input
            name="children"
            type="number"
            value={form.children}
            onChange={handleChange}
            style={inputStyle}
          />
        </Field>

        <Field label="Monthly rent (£)" error={errors.rent}>
          <input
            name="rent"
            type="number"
            value={form.rent}
            onChange={handleChange}
            style={inputStyle}
          />
        </Field>

        <Field label="Do you have a disability and/or LCWRA (Limited Capability for Work-Related Activity)?">
          <select
            name="hasDisability"
            value={form.hasDisability}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="no">No</option>
            <option value="yes">Yes - I have a disability and/or LCWRA</option>
          </select>
        </Field>

        <div>
  <label>Savings / capital (£)</label>
  <input
    name="capital"
    type="number"
    value={form.capital}
    onChange={handleChange}
    style={inputStyle}
  />
</div>

<div>
  <label>Do you get housing element?</label>
  <select
    name="hasHousingElement"
    value={form.hasHousingElement}
    onChange={handleChange}
    style={inputStyle}
  >
    <option value="yes">Yes</option>
    <option value="no">No</option>
  </select>
</div>

        <button onClick={calculate} style={buttonStyle} disabled={loading}>
          {loading ? "Calculating..." : "Calculate Benefits"}
        </button>
      </div>

      {result?.breakdown ? (
  <div style={resultCard}>
    <div style={resultHeader}>
      <div>
        <p style={mutedText}>Estimated monthly Universal Credit</p>
        <h2 style={resultAmount}>£{result.uc ?? "0.00"}</h2>
      </div>
    </div>

    <div style={breakdownGrid}>
      <BreakdownItem label="Standard allowance" value={result.breakdown.standard} />
      <BreakdownItem label="Children" value={result.breakdown.children} />
      <BreakdownItem label="Housing" value={result.breakdown.rent} />
      <BreakdownItem label="Disability / LCWRA" value={result.breakdown.disability} />
      <BreakdownItem label="Capital" value={Number(form.capital || 0)} />
    </div>

    <div style={divider} />

    <div style={deductionRow}>
      <span>Income deduction</span>
      <strong>£{result.breakdown.deduction}</strong>
    </div>
  </div>
) : result?.error ? (
  <div style={errorBox}>
    <h2 style={{ marginTop: 0 }}>Connection error</h2>
    <p>{result.error}</p>
    {result.details ? <p>{result.details}</p> : null}
  </div>
) : null }
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
      {error ? <p style={errorStyle}>{error}</p> : null}
    </div>
  );
}

function BreakdownItem({ label, value }: { label: string; value: number }) {
  return (
    <div style={breakdownItem}>
      <span style={mutedText}>{label}</span>
      <strong>£{value}</strong>
    </div>
  );
}
const errorBox: React.CSSProperties = {
  marginTop: "24px",
  padding: "20px",
  background: "#fff4f4",
  borderRadius: "10px",
  border: "1px solid #f1b0b7",
  color: "#8a1c1c",
};
const containerStyle: React.CSSProperties = {
  maxWidth: "900px",
  margin: "0 auto",
  padding: "32px",
  background: "#ffffff",
  borderRadius: "20px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
};

const titleStyle: React.CSSProperties = {
  fontSize: "28px",
  marginBottom: "20px",
  color: "#111827",
};

const formGrid: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "8px",
  fontWeight: 600,
  color: "#111827",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  fontSize: "16px",
  color: "#111827",
  backgroundColor: "#ffffff",
  boxSizing: "border-box",
};

const errorStyle: React.CSSProperties = {
  color: "#c62828",
  fontSize: "13px",
  marginTop: "6px",
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

const resultCard: React.CSSProperties = {
  marginTop: "24px",
  padding: "20px",
  background: "#f8fbff",
  borderRadius: "14px",
  border: "1px solid #dbe8ff",
};

const resultHeader: React.CSSProperties = {
  marginBottom: "16px",
};

const mutedText: React.CSSProperties = {
  color: "#4b5563",
  marginBottom: "8px",
};

const resultAmount: React.CSSProperties = {
  margin: "6px 0 0 0",
  fontSize: "34px",
  color: "#0b57d0",
};

const breakdownGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
};

const breakdownItem: React.CSSProperties = {
  background: "white",
  border: "1px solid #e6eefc",
  borderRadius: "10px",
  padding: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const divider: React.CSSProperties = {
  height: "1px",
  background: "#dbe8ff",
  margin: "18px 0",
};

const deductionRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};