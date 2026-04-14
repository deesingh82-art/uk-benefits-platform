import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Benefits Checker",
  description: "Check possible UK benefits and LCWRA support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif", background: "#f5f7fb" }}>
        <header
          style={{
            background: "white",
            borderBottom: "1px solid #ddd",
            padding: "16px 24px",
            position: "sticky",
            top: 0,
            zIndex: 10,
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
            <div style={{ fontSize: "22px", fontWeight: "bold" }}>
              Benefits Checker
            </div>

            <nav style={{ display: "flex", gap: "20px" }}>
              <Link href="/" style={navLinkStyle}>
                Calculator
              </Link>
              <Link href="/lcwra" style={navLinkStyle}>
                LCWRA Checker
              </Link>
            </nav>
          </div>
        </header>

        <body>
  <div style={{ padding: "30px 20px" }}>
    {children}

    <footer style={{ marginTop: 40, textAlign: "center" }}>
      <a href="/disclaimer" style={navLinkStyle}>Disclaimer</a> |{" "}
      <a href="/privacy">Privacy</a> |{" "}
      <a href="/terms">Terms</a>
    </footer>
  </div>
</body>
    </html>
  );
}

const navLinkStyle: React.CSSProperties = {
  color: "#0070f3",
  textDecoration: "none",
  fontWeight: "bold",

};
