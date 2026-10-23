import React from "react";
import Link from "next/link";
import { Repeat, Leaf, ShieldCheck, HeartHandshake, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-forest-900/5 dark:bg-forest-900/60 border border-forest-900/15 dark:border-forest-700 text-forest-900 dark:text-emerald-300 rounded-full text-xs font-semibold">
          <span>About LoopSpace</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Empowering Campuses Through Circular Sharing
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Built by students, for students. LoopSpace is an open circular economy platform that eliminates unnecessary academic costs and minimizes campus waste.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <div className="bg-white dark:bg-[#12281e] p-8 rounded-3xl border border-forest-900/10 dark:border-forest-800 shadow-subtle space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-600" />
            <span>The Campus Problem We Address</span>
          </h2>
          <p>
            Every semester, thousands of college students buy costly textbooks, scientific graphing calculators, single-use lab coats, and project equipment that sit idle once the semester ends. At the same time, incoming freshmen struggle with high academic supply costs.
          </p>
          <p>
            LoopSpace provides a safe, organized, university-focused platform where students can lend items temporarily, exchange tools with peers, donate what they no longer need, or post urgent academic needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#12281e] p-6 rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Verified & Safe Handovers
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Pickups are arranged at transparent, public campus meeting zones such as university libraries, student recreation hubs, or departmental courtyards.
            </p>
          </div>

          <div className="bg-white dark:bg-[#12281e] p-6 rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle space-y-3">
            <div className="w-10 h-10 rounded-xl bg-lime-100 dark:bg-forest-900 text-forest-900 dark:text-lime-300 flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Circular Economy Gamification
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Every completed loop awards Loop Impact Points and achievement badges, recognizing individuals who actively prevent waste on campus.
            </p>
          </div>
        </div>

        <div className="p-6 bg-forest-50/70 dark:bg-forest-900/40 rounded-2xl border border-forest-900/10 dark:border-forest-800 text-xs space-y-2">
          <h4 className="font-bold text-slate-900 dark:text-white">
            Transparency & Institutional Notice
          </h4>
          <p className="text-slate-600 dark:text-slate-400">
            LoopSpace is an independent student platform designed to be adaptable across colleges. It does not claim an official, exclusive university sponsorship unless verified by campus administration.
          </p>
        </div>
      </div>
    </div>
  );
}
