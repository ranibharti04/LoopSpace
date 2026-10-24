
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  Repeat,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, isSupabaseLive } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [collegeName, setCollegeName] = useState(
    "State University of Technology"
  );
  const [department, setDepartment] = useState(
    "Computer Science & Engineering"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!isSupabaseLive) {
        throw new Error(
          "Supabase is not configured. Please check your .env.local settings."
        );
      }

      await signUp({
        fullName,
        email: email.trim(),
        password,
        collegeName,
        department,
      });

      router.push(
        `/auth/verify-otp?email=${encodeURIComponent(email.trim())}`
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to create account."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-3 text-sm rounded-xl border border-slate-200 dark:border-forest-700 bg-white dark:bg-[#0c1f17] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white dark:bg-[#12281e] p-8 rounded-3xl border border-forest-900/10 dark:border-forest-800 shadow-elevated space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-forest-900 dark:bg-emerald-600 flex items-center justify-center text-white mx-auto shadow-md">
            <Repeat className="w-6 h-6 text-lime-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Join LoopSpace
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Share more. Waste less.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-300 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                className={`${inputClass} pl-10`}
                required
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                className={`${inputClass} pl-10`}
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gmail.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                className={`${inputClass} pl-10`}
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">
              College / University
            </label>
            <input
              className={inputClass}
              required
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">
              Major / Department
            </label>
            <input
              className={inputClass}
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-forest-900 hover:bg-forest-950 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{isLoading ? "Sending verification..." : "Create Account"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
