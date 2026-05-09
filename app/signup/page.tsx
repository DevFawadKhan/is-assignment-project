"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 6;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    if (!minLength) return "Password must be at least 6 characters long.";
    if (!hasUpper) return "Password must contain at least one uppercase letter.";
    if (!hasLower) return "Password must contain at least one lowercase letter.";
    if (!hasNumber) return "Password must contain at least one number.";
    if (!hasSpecial) return "Password must contain at least one special character.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic Email Validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Password Validation
    const passError = validatePassword(formData.password);
    if (passError) {
      toast.error(passError);
      return;
    }

    setLoading(true);

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

      toast.success("Account created successfully! Please log in.");
      router.push("/login?registered=true");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-8 bg-black">
      <div className="bg-white p-8 md:p-12 rounded-[24px] w-full max-w-[440px] animate-slide-up shadow-2xl border border-gray-100">
        <h1 className="text-3xl font-bold tracking-tight text-black mb-2 text-center">Create Account</h1>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8 text-center">
          Join us today. Enter your details to get started.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-black focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all"
              placeholder="Fawad Khan"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-black focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-black focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all pr-12"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2" 
            disabled={loading}
          >
            {loading ? <span className="spinner border-white"></span> : "Sign Up"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-black font-bold hover:underline transition-colors">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
