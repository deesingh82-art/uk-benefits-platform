"use client";

import { useEffect, useState } from "react";

type ConfigState = {
  uc_standard_under_25: string;
  uc_standard_over_25: string;
  child_element: string;
  lcwra: string;
  taper_rate: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [config, setConfig] = useState<ConfigState>({
    uc_standard_under_25: "",
    uc_standard_over_25: "",
    child_element: "",
    lcwra: "",
    taper_rate: "",
  });

  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        setConfig({
          uc_standard_under_25: String(data.uc_standard_under_25 ?? ""),
          uc_standard_over_25: String(data.uc_standard_over_25 ?? ""),
          child_element: String(data.child_element ?? ""),
          lcwra: String(data.lcwra ?? ""),
          taper_rate: String(data.taper_rate ?? ""),
        });
      });
  }, []);

  const save = async () => {
    setStatus("Saving...");

    const res = await fetch("/api/config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        data: config,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("Saved successfully");
    } else {
      setStatus(`${data.error}${data.details ? `: ${data.details}` : ""}`);
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Admin - Live Rates</h1>

      <div style={formStyle}>
        <div>
          <label style={labelStyle}>Admin password</label>
          <input
            type="password"
            name="admin-password"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>UC under 25</label>
          <input
          autoComplete="off"
            value={config.uc_standard_under_25}
            onChange={(e) =>
              setConfig({ ...config, uc_standard_under_25: e.target.value })
            }
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>UC 25 or over</label>
          <input
          autoComplete="off"
            value={config.uc_standard_over_25}
            onChange={(e) =>
              setConfig({ ...config, uc_standard_over_25: e.target.value })
            }
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Child element</label>
          <input
          autoComplete="off"
            value={config.child_element}
            onChange={(e) =>
              setConfig({ ...config, child_element: e.target.value })
            }
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>LCWRA</label>
          <input
          autoComplete="off"
            value={config.lcwra}
            onChange={(e) =>
              setConfig({ ...config, lcwra: e.target.value })
            }
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Taper rate</label>
          <input
          autoComplete="off"
            value={config.taper_rate}
            onChange={(e) =>
              setConfig({ ...config, taper_rate: e.target.value })
            }
            style={inputStyle}
          />
        </div>

        <button onClick={save} style={buttonStyle}>
          Save live rates
        </button>

        {status ? <p>{status}</p> : null}
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  maxWidth: "700px",
  margin: "0 auto",
  padding: "20px",
  background: "white",
  borderRadius: "16px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
};

const titleStyle: React.CSSProperties = {
  fontSize: "28px",
  marginBottom: "20px",
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "6px",
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "8px",
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