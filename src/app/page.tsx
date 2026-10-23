"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Repeat,
  Sparkles,
  Search,
  ArrowRight,
  BookOpen,
  Cpu,
  FlaskConical,
  Trophy,
  PenTool,
  PartyPopper,
  ShieldCheck,
  Leaf,
  Users,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import { getResources } from "@/lib/data-service";
import { Resource } from "@/types";
import { ResourceCard } from "@/components/resources/ResourceCard";

const CATEGORIES = [
  { name: "Books & Notes", count: "140+ Listed", icon: BookOpen, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50" },
  { name: "Electronics", count: "85+ Items", icon: Cpu, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50" },
  { name: "Lab Equipment", count: "40+ Tools", icon: FlaskConical, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/50" },
  { name: "Sports & Fitness", count: "55+ Gears", icon: Trophy, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50" },
  { name: "Stationery", count: "70+ Packs", icon: PenTool, color: "text-teal-600 bg-teal-50 dark:bg-teal-950/50" },
  { name: "Decor & Events", count: "30+ Sets", icon: PartyPopper, color: "text-rose-600 bg-rose-50 dark:bg-rose-950/50" },
];

const TESTIMONIALS = [
  {
    quote: "I borrowed a TI-84 Plus graphing calculator for my calculus midterms instead of spending $130 on a device I only needed for 2 weeks. Returned it in mint condition!",
    name: "Alex Chen",
    dept: "Computer Science Sophomore",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    badge: "Demo Persona",
  },
  {
    quote: "When I finished organic chemistry lab, I donated my lab coat and safety goggles to an incoming freshman on LoopSpace. Earned 25 impact points and made a friend!",
    name: "Elena Rodriguez",
    dept: "Biomedical Sciences Senior",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
    badge: "Demo Persona",
  },
  {
    quote: "Our robotics club swapped unused Arduino sensors for an extra oscilloscope with Marcus from Mechanical. Real circular campus economy at work.",
    name: "Priya Patel",
    dept: "Electrical Engineering Junior",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80",
    badge: "Demo Persona",
  },
];

const FAQS = [
  {
    q: "How does borrowing and lending work on LoopSpace?",
    a: "Students list items they own (or post what they need). When someone submits a request, the owner reviews it, agrees on a campus pickup spot (e.g. library or quad), and hands over the item. Once returned, both confirm completion.",
  },
  {
    q: "How is the Need–Offer Matching Engine different from regular search?",
    a: "Our matching engine evaluates category alignment, title/description semantic overlap, date windows, item condition, and campus location to compute a transparent compatibility score (up to 100%) with exact reasons why an item fits your need.",
  },
  {
    q: "What are Loop Impact Points?",
    a: "Points are earned whenever you complete an exchange, loan, or donation. Points unlock campus achievement badges (First Loop, Helpful Neighbor, Resource Saver, Community Champion) and celebrate students who reduce campus waste.",
  },
  {
    q: "Are the carbon and cost savings real?",
    a: "Our estimates are transparently calculated using published life-cycle assessment (LCA) benchmarks for student textbooks, lab supplies, and electronics. They are labeled clearly as estimates.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentResources, setRecentResources] = useState<Resource[]>([]);

  useEffect(() => {
    async function loadData() {
      const data = await getResources();
      setRecentResources(data.slice(0, 4));
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/explore");
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 bg-gradient-to-b from-forest-50/70 via-transparent to-transparent dark:from-forest-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-900/5 dark:bg-forest-900/60 border border-forest-900/15 dark:border-forest-700 text-forest-900 dark:text-emerald-300 text-xs font-semibold backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Smart Campus Resource Sharing & Circular Economy</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Share More. Waste Less. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-forest-800 to-emerald-500 dark:from-emerald-400 dark:to-lime-400">
                Build Together.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Connect with fellow students to lend, borrow, exchange, or donate textbooks, calculators, lab gear, and sports equipment. Save money and cut campus waste together.
            </p>

            {/* Quick Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-xl mx-auto flex items-center bg-white dark:bg-[#12281e] rounded-2xl shadow-elevated border border-forest-900/15 dark:border-forest-800 p-2 gap-2"
            >
              <div className="flex-1 flex items-center pl-3 gap-2">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What do you need? (e.g. TI-84, Algorithms, Lab Coat)..."
                  className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-forest-900 hover:bg-forest-950 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>Find</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Action Links */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Popular on campus:</span>
              <Link href="/explore?category=Books+%26+Notes" className="px-2.5 py-1 bg-white dark:bg-forest-900/40 border border-slate-200 dark:border-forest-800 rounded-lg hover:border-emerald-500 transition-colors">
                📚 CS & Math Textbooks
              </Link>
              <Link href="/explore?category=Electronics" className="px-2.5 py-1 bg-white dark:bg-forest-900/40 border border-slate-200 dark:border-forest-800 rounded-lg hover:border-emerald-500 transition-colors">
                🧮 Graphing Calculators
              </Link>
              <Link href="/match" className="px-2.5 py-1 bg-lime-50 dark:bg-forest-900 border border-lime-300 dark:border-forest-700 text-forest-900 dark:text-lime-300 font-semibold rounded-lg hover:bg-lime-100 transition-colors flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-lime-400" />
                <span>Need–Offer Matcher</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Campus Impact Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest-900 dark:bg-[#12281e] rounded-3xl text-white p-8 sm:p-12 shadow-elevated border border-emerald-500/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-forest-700/60">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-lime-400">
                <Leaf className="w-6 h-6" />
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">184 kg</span>
              </div>
              <p className="text-xs uppercase font-bold tracking-wider text-emerald-200">
                Estimated CO2 Avoided
              </p>
              <p className="text-[11px] text-slate-300 max-w-xs mx-auto">
                By circulating textbooks & lab gear rather than purchasing new single-use items.
              </p>
            </div>

            <div className="pt-6 md:pt-0 space-y-2">
              <div className="flex items-center justify-center gap-2 text-lime-400">
                <TrendingUp className="w-6 h-6" />
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">$3,420+</span>
              </div>
              <p className="text-xs uppercase font-bold tracking-wider text-emerald-200">
                Student Money Saved
              </p>
              <p className="text-[11px] text-slate-300 max-w-xs mx-auto">
                Calculated using average university bookstore retail benchmark prices.
              </p>
            </div>

            <div className="pt-6 md:pt-0 space-y-2">
              <div className="flex items-center justify-center gap-2 text-lime-400">
                <Repeat className="w-6 h-6" />
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">320+</span>
              </div>
              <p className="text-xs uppercase font-bold tracking-wider text-emerald-200">
                Resources Circulated
              </p>
              <p className="text-[11px] text-slate-300 max-w-xs mx-auto">
                Across 14 campus academic departments and residence halls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Browse by Campus Need
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Find essential supplies listed by students across all disciplines
            </p>
          </div>
          <Link
            href="/explore"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View All Items</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/explore?category=${encodeURIComponent(cat.name)}`}
                className="group bg-white dark:bg-[#12281e] p-5 rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center space-y-3"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {cat.count}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-lime-400">
            Simple 3-Step Lifecycle
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            How LoopSpace Works
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Safe, verified, peer-to-peer sharing designed specifically for college life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#12281e] p-6 rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle space-y-4">
            <div className="w-10 h-10 rounded-xl bg-forest-900 text-white flex items-center justify-center font-bold text-sm shadow-md">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              List or Search What You Need
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Post an item you want to lend, donate, or swap. Looking for something? Use the smart Need Matcher to find campus matches in seconds.
            </p>
          </div>

          <div className="bg-white dark:bg-[#12281e] p-6 rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Agree on Campus Pickup
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              When a request is accepted, pick a convenient campus spot like the Library North Desk or the Engineering Quad for safe, zero-cost handover.
            </p>
          </div>

          <div className="bg-white dark:bg-[#12281e] p-6 rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle space-y-4">
            <div className="w-10 h-10 rounded-xl bg-lime-500 text-forest-950 flex items-center justify-center font-bold text-sm shadow-md">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Return & Earn Impact Points
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Hand the item back when your coursework is done. Both confirm completion to automatically award Loop Impact Points and unlock badges!
            </p>
          </div>
        </div>
      </section>

      {/* 5. Recently Listed Resources */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Recently Listed on Campus
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Active resources available right now for borrow, swap, or free donation
            </p>
          </div>
          <Link
            href="/explore"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Explore All Listings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentResources.map((res) => (
            <ResourceCard key={res.id} resource={res} />
          ))}
        </div>
      </section>

      {/* 6. Testimonials (Clearly labeled demo personas) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Student Stories (Demo Seed Content)
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Loved by Campus Students
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#12281e] p-6 rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle flex flex-col justify-between space-y-4"
            >
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-forest-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{t.name}</p>
                    <span className="text-[9px] bg-slate-100 dark:bg-forest-900 text-slate-500 px-1.5 py-0.5 rounded font-medium">
                      {t.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{t.dept}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Everything you need to know about circular campus sharing
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-[#12281e] p-5 rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle space-y-2"
            >
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 pl-6 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-emerald-950 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-elevated border border-emerald-500/20">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Share More and Waste Less?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Join your campus circular network today. List textbooks, lab gear, and calculators, or borrow from trusted peers.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/resources/create"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              List an Item for Free
            </Link>
            <Link
              href="/explore"
              className="px-6 py-3 bg-forest-800/80 hover:bg-forest-800 text-white rounded-xl text-sm font-semibold border border-forest-700 transition-colors"
            >
              Browse All Resources
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
