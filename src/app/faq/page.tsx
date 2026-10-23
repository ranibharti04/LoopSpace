import React from "react";
import Link from "next/link";
import { HelpCircle, ChevronRight } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "Who can use LoopSpace?",
    a: "Any college student or university member! You can register with your student email, configure your college and department, and immediately start discovering or listing items.",
  },
  {
    q: "What types of items can I list on LoopSpace?",
    a: "Academic textbooks, study notes, graphing calculators, lab coats, safety goggles, Arduino/IoT kits, sports gear, dorm event decorations, and drafting tools.",
  },
  {
    q: "What happens if an item is not returned on time?",
    a: "LoopSpace provides due-date reminders and tracking. Users can request returns directly from their dashboard. Unresolved issues can be reported to campus moderators for review.",
  },
  {
    q: "Can I swap items instead of borrowing?",
    a: "Yes! Choose the 'Exchange / Swap' sharing type when listing an item. You can specify what you are seeking in return (e.g., swapping a calculus book for an electronics breadboard).",
  },
  {
    q: "How are Loop Impact Points calculated?",
    a: "You earn 20 points for completing a temporary loan, 25 points for donating an item permanently, 20 points for an item exchange, and 10 points for fulfilling a posted need.",
  },
  {
    q: "How does the Google Sheets integration work for admins?",
    a: "Authorized administrators can sync platform inventory, sharing logs, and monthly impact summaries to a linked Google Sheet with a single click via secure server-side Google Sheets API routes.",
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Got questions about resource sharing, matching, or impact points? We have answers.
        </p>
      </div>

      <div className="space-y-4">
        {FAQ_ITEMS.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-[#12281e] p-6 rounded-2xl border border-forest-900/10 dark:border-forest-800 shadow-subtle space-y-2"
          >
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{item.q}</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 pl-7 leading-relaxed">
              {item.a}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <p className="text-xs text-slate-500">
          Still have questions?{" "}
          <Link href="/contact" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
            Reach out via our Contact page
          </Link>
        </p>
      </div>
    </div>
  );
}
