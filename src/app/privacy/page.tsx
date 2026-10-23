import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400 mt-1">Last Updated: October 2026</p>
      </div>

      <div className="bg-white dark:bg-[#12281e] p-8 rounded-3xl border border-forest-900/10 dark:border-forest-800 shadow-subtle space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Information We Collect
          </h2>
          <p>
            LoopSpace collects student profile information (name, college email, department, college name, and optional avatar) solely to facilitate peer-to-peer resource sharing. Phone numbers are private by default and only disclosed with explicit consent on accepted borrow requests.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. How We Protect Your Data
          </h2>
          <p>
            We implement PostgreSQL Row Level Security (RLS) policies within Supabase. Users can only access requests they are parties to. Passwords are never stored in plaintext and administrative operations are verified through server-side roles.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. Google Sheets Export Privacy
          </h2>
          <p>
            Google Sheets export functions operate strictly server-side using authorized service account credentials. Private keys and authorization tokens are never exposed to client browsers. Only authorized administrators can trigger exports.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Account Deletion
          </h2>
          <p>
            Users can permanently delete their account and associated resource listings at any time through their Account Settings page.
          </p>
        </section>
      </div>
    </div>
  );
}
