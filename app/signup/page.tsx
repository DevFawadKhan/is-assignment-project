"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
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

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to sign up");
      }

      // Automatically push the user directly to the login interface so they can use their new credentials
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="glass p-8 md:p-12 rounded-[24px] w-full max-w-[440px] animate-slide-up">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2 text-center">Create Account</h1>
        <p className="text-text-muted text-sm md:text-base leading-relaxed mb-8 text-center">
          Join us today. Enter your details to get started.
        </p>

        {error && <div className="text-error bg-error/10 p-3 rounded-lg border border-error/20 text-sm mb-6 animate-fade-in text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-muted" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full p-3.5 bg-input-bg border border-glass-border rounded-xl text-text-main focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 outline-none transition-all"
              placeholder="Fawad Khan"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

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
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-accent-primary hover:bg-accent-hover text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-accent-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2" 
            disabled={loading}
          >
            {loading ? <span className="spinner"></span> : "Sign Up"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-accent-primary font-semibold hover:underline transition-colors hover:text-blue-400">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
