import React from "react";

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-400 mt-1">Last Updated: October 2026</p>
      </div>

      <div className="bg-white dark:bg-[#12281e] p-8 rounded-3xl border border-forest-900/10 dark:border-forest-800 shadow-subtle space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Campus Conduct & Responsibility
          </h2>
          <p>
            LoopSpace is designed for mutual aid and collaboration. Borrowers are expected to treat shared calculators, books, lab equipment, and gear with care and return items within the agreed availability window.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. Prohibited Items
          </h2>
          <p>
            Users may not list prohibited academic materials (e.g. unreleased exams or answer sheets), dangerous lab chemicals, prescription medication, or hazardous materials. Listings violating these rules are subject to immediate removal by campus administrators.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. Independent Platform Notice
          </h2>
          <p>
            LoopSpace is a student-built software platform. It is not an official university retail bookstore or warranty provider. Exchanges are peer-to-peer agreements between participating campus students.
          </p>
        </section>
      </div>
    </div>
  );
}
