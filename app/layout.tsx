import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Benefits Checker",
  description: "UK benefits calculator and LCWRA checker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header
          style={{
            background: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            padding: "20px 24px",
          }}
        >
          <div
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Benefits Checker
            </div>

            <nav style={{ display: "flex", gap: "24px" }}>
              <Link href="/" style={navLinkStyle}>
                Calculator
              </Link>
              <Link href="/lcwra" style={navLinkStyle}>
                LCWRA Checker
              </Link>
            </nav>
          </div>
        </header>

        <main style={{ padding: "30px 20px" }}>{children}</main>

        <footer
          style={{
            marginTop: "40px",
            padding: "20px",
            textAlign: "center",
            borderTop: "1px solid #e5e7eb",
            background: "#ffffff",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <Link href="/disclaimer" style={footerLinkStyle}>
              Disclaimer
            </Link>
            <Link href="/privacy" style={footerLinkStyle}>
              Privacy
            </Link>
            <Link href="/terms" style={footerLinkStyle}>
              Terms
            </Link>
            <Link href="/help" style={footerLinkStyle}>
              Get Help
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}

const navLinkStyle: React.CSSProperties = {
  color: "#0070f3",
  textDecoration: "none",
  fontWeight: "bold",
};

const footerLinkStyle: React.CSSProperties = {
  color: "#0070f3",
  textDecoration: "none",
  fontWeight: 600,
};