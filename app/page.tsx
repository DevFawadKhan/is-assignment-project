"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Hit our exact, custom API endpoint which natively dismantles the HTTP-only cookie limit!
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to log out");
      }

      // Immediately redirect to the login module sequentially.
      router.push("/login");
    } catch (err) {
      console.error(err);
      alert("There was an error logging out.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="glass-panel" style={{ maxWidth: "600px" }}>
        <h1 className="heading-main">Dashboard Operations</h1>
        <p className="heading-sub">
          You are securely authenticated and viewing the protected home route.
        </p>

        <div className="metadata-box">
          <h3 style={{ marginBottom: "1rem", color: "#fff" }}>Quick Links</h3>
          <ul style={{ lineHeight: "2", listStyle: "circle", paddingLeft: "1.5rem" }}>
            <li>
              <Link href="/login" className="link">Go to Login Page Test</Link>
            </li>
            <li>
              <Link href="/signup" className="link">Go to Signup Page Test</Link>
            </li>
          </ul>
        </div>

        <button 
          onClick={handleLogout} 
          className="btn-primary" 
          disabled={loading}
          style={{ background: "var(--error-color)", marginTop: "2rem" }}
        >
          {loading ? <span className="spinner"></span> : "Log Out Securely"}
        </button>
      </div>
    </div>
  );
}
