"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Repeat,
  PlusCircle,
  Bell,
  User,
  Sun,
  Moon,
  Menu,
  X,
  Compass,
  ShieldAlert,
  LogOut,
  LayoutDashboard,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useTheme } from "@/context/theme-context";

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout, switchDemoUser, availableDemoUsers } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const navLinks = [
    { label: "Explore Resources", href: "/explore", icon: Compass },
    { label: "Need–Offer Matcher", href: "/match", icon: Repeat, badge: "Smart" },
    { label: "Impact & Badges", href: "/impact", icon: Sparkles },
    ...(isAuthenticated ? [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }] : []),
    ...(isAdmin ? [{ label: "Admin Panel", href: "/admin", icon: ShieldAlert }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-forest-900/10 bg-[#FBFBF7]/90 dark:bg-[#0c1f17]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-forest-900 dark:bg-emerald-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-lime-400 group-hover:rotate-180 transition-transform duration-500"
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 21h5v-5" />
                <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-forest-950 dark:text-emerald-50">
                Loop<span className="text-emerald-600 dark:text-lime-400">Space</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400 -mt-1">
                Share More • Waste Less
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-forest-900 text-white dark:bg-emerald-600 dark:text-white shadow-sm"
                      : "text-slate-700 dark:text-slate-300 hover:bg-forest-100/60 dark:hover:bg-forest-900/40 hover:text-forest-900 dark:hover:text-emerald-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 bg-lime-300 dark:bg-lime-500 text-forest-950 font-bold rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons & Profile */}
          <div className="hidden md:flex items-center gap-3">
            {/* Post Resource CTA */}
            <Link
              href="/resources/create"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Item</span>
            </Link>

            {/* Notification Bell */}
            {isAuthenticated && (
              <Link
                href="/dashboard/notifications"
                className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-forest-900 dark:hover:text-white rounded-lg hover:bg-forest-100/60 dark:hover:bg-forest-900/40 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-forest-900 dark:hover:text-white rounded-lg hover:bg-forest-100/60 dark:hover:bg-forest-900/40 transition-colors"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-300" />}
            </button>

            {/* User Profile / Quick Switcher for Viva Demo */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full border border-forest-900/15 dark:border-forest-700 hover:bg-forest-50 dark:hover:bg-forest-900/40 transition-all text-xs"
                >
                  <div className="flex flex-col text-right">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{user.full_name}</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      {user.impact_points} pts {user.role === "admin" && "• Admin"}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-sm overflow-hidden">
                    {user.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                    ) : (
                      user.full_name.charAt(0)
                    )}
                  </div>
                </button>

                {demoMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#12281e] rounded-xl shadow-elevated border border-slate-200 dark:border-forest-800 p-2 text-sm z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-forest-800">
                      <p className="font-semibold text-slate-900 dark:text-white">{user.full_name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                        {user.college_name}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setDemoMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-forest-50 dark:hover:bg-forest-900/40 rounded-lg text-xs"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                        <span>My Dashboard</span>
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setDemoMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-forest-50 dark:hover:bg-forest-900/40 rounded-lg text-xs"
                      >
                        <User className="w-4 h-4 text-emerald-600" />
                        <span>Profile & Settings</span>
                      </Link>
                    </div>

                    {/* Quick Demo Switcher for Viva Evaluation */}
                    <div className="pt-2 border-t border-slate-100 dark:border-forest-800">
                      <p className="px-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                        Switch Persona (Viva Demo)
                      </p>
                      {availableDemoUsers.map((demo) => (
                        <button
                          key={demo.id}
                          onClick={() => {
                            switchDemoUser(demo.id);
                            setDemoMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-lg transition-colors ${
                            demo.id === user.id
                              ? "bg-forest-100 dark:bg-forest-900/60 text-forest-900 dark:text-emerald-300 font-medium"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-forest-900/30"
                          }`}
                        >
                          <span className="truncate">
                            {demo.full_name} {demo.role === "admin" && "(Admin)"}
                          </span>
                          {demo.id === user.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-forest-800">
                      <button
                        onClick={() => {
                          logout();
                          setDemoMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-3 py-1.5 text-sm font-medium text-forest-900 dark:text-emerald-400 hover:underline"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-3.5 py-1.5 bg-forest-900 hover:bg-forest-950 text-white text-sm font-semibold rounded-lg shadow-sm"
                >
                  Join Campus
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 rounded-lg"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-300" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-forest-100/60 dark:hover:bg-forest-900/40"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-forest-800 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-base font-medium text-slate-800 dark:text-slate-200 rounded-lg hover:bg-forest-100/60 dark:hover:bg-forest-900/40"
                >
                  <Icon className="w-5 h-5 text-emerald-600" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <Link
              href="/resources/create"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 text-white rounded-lg font-semibold text-sm mt-3"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List New Item</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
