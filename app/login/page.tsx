"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setRegistered(true);
    }
  }, [searchParams]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRegistered(false);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to log in");
      }

      // Automatically redirect to the dashboard/home upon successful login
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="glass p-8 md:p-12 rounded-[24px] w-full max-w-[440px] animate-slide-up">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2 text-center">Welcome Back</h1>
        <p className="text-text-muted text-sm md:text-base leading-relaxed mb-8 text-center">
          Please enter your credentials to log in.
        </p>

        {registered && (
          <div className="text-emerald-400 bg-emerald-400/10 p-3 rounded-lg border border-emerald-400/20 text-sm mb-6 animate-fade-in text-center">
            Account created seamlessly! Log in below.
          </div>
        )}

        {error && <div className="text-error bg-error/10 p-3 rounded-lg border border-error/20 text-sm mb-6 animate-fade-in text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-muted" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-3.5 bg-input-bg border border-glass-border rounded-xl text-text-main focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 outline-none transition-all"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-muted" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-3.5 bg-input-bg border border-glass-border rounded-xl text-text-main focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 outline-none transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-accent-primary hover:bg-accent-hover text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-accent-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2" 
            disabled={loading}
          >
            {loading ? <span className="spinner"></span> : "Log In"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-text-muted">
          Don't have an account?{" "}
          <Link href="/signup" className="text-accent-primary font-semibold hover:underline transition-colors hover:text-blue-400">
            Sign up securely
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="app-container"><div className="glass-panel"><p className="heading-sub">Loading authentication...</p></div></div>}>
      <LoginForm />
    </Suspense>
  );
}
