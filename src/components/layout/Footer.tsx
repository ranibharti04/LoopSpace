import React from "react";
import Link from "next/link";
import { Repeat, ShieldCheck, Heart, Leaf, BookOpen, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-forest-950 text-slate-300 pt-16 pb-12 border-t border-forest-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-forest-900/60">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <Repeat className="w-5 h-5 text-lime-300" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Loop<span className="text-emerald-400">Space</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              A student-driven circular economy platform designed to eliminate unnecessary spending, reduce campus e-waste, and make academic materials accessible to everyone.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400/90 font-medium pt-1">
              <Leaf className="w-4 h-4 text-lime-400 shrink-0" />
              <span>Share More. Waste Less. Build Together.</span>
            </div>
          </div>

          {/* Platform Nav */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4">
              Explore Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/explore" className="hover:text-emerald-400 transition-colors">
                  All Resources
                </Link>
              </li>
              <li>
                <Link href="/match" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>Need–Offer Matcher</span>
                  <span className="text-[10px] bg-emerald-800 text-emerald-200 px-1.5 py-0.5 rounded font-bold">New</span>
                </Link>
              </li>
              <li>
                <Link href="/resources/create" className="hover:text-emerald-400 transition-colors">
                  List an Item
                </Link>
              </li>
              <li>
                <Link href="/impact" className="hover:text-emerald-400 transition-colors">
                  Campus Impact & Badges
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">
                  User Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic Categories */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4">
              Popular Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/explore?category=Books+%26+Notes" className="hover:text-emerald-400 transition-colors">
                  Textbooks & Notes
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Electronics" className="hover:text-emerald-400 transition-colors">
                  Calculators & Electronics
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Lab+Equipment" className="hover:text-emerald-400 transition-colors">
                  Lab Coats & Glassware
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Sports+%26+Fitness" className="hover:text-emerald-400 transition-colors">
                  Sports Gear & Equipment
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Stationery" className="hover:text-emerald-400 transition-colors">
                  Stationery & Drafting Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Information & Legal */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4">
              Transparency & Help
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">
                  About LoopSpace
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-emerald-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                  Contact & Feedback
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} LoopSpace Platform. Built with Next.js, Supabase & Google Sheets.
          </p>
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero-cost circular sharing. No real institutional claims made.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
