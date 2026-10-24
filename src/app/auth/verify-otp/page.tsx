
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (!email) {
        throw new Error("Email is missing. Please sign up again.");
      }

      const supabase = createClient();

      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp.trim(),
        type: "signup",
      });

      if (error) throw error;

      if (!data.session) {
        throw new Error("Verification succeeded, but no session was created. Please sign in.");
      }

      setMessage("Email verified successfully!");
      router.replace("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (!email) {
        throw new Error("Email is missing. Please sign up again.");
      }

      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (error) throw error;

      setMessage("A new verification code has been requested. Check your inbox.");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Could not resend the OTP."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border bg-white dark:bg-[#12281e] p-8 shadow-lg space-y-5">
        <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white">
          Verify your email
        </h1>

        <p className="text-sm text-center text-slate-600 dark:text-slate-300">
          Enter the verification code sent to <strong>{email || "your email"}</strong>.
        </p>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {message && (
          <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {message}
          </p>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{8}"
            maxLength={8}
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter 8-digit OTP"
            className="w-full rounded-xl border p-3 text-center text-lg tracking-widest text-slate-900"
          />

          <button
            type="submit"
            disabled={loading || otp.length !== 8 || !email}
            className="w-full rounded-xl bg-emerald-700 p-3 font-bold text-white disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <button
          type="button"
          onClick={resendOtp}
          disabled={loading || !email}
          className="w-full text-sm font-semibold text-emerald-700 hover:underline disabled:opacity-50"
        >
          Resend OTP
        </button>
      </div>
    </main>
  );
}
