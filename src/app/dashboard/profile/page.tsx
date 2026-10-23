"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { uploadResourceImage } from "@/lib/storage";
import {
  User,
  Mail,
  School,
  Phone,
  Shield,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  Lock,
  UploadCloud,
} from "lucide-react";

export default function ProfileSettingsPage() {
  const { user, updateProfile, deleteAccount } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || "");
  const [collegeName, setCollegeName] = useState(user?.college_name || "State University of Technology");
  const [department, setDepartment] = useState(user?.department || "Computer Science & Engineering");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isPhonePublic, setIsPhonePublic] = useState(user?.is_phone_public || false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || "");

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      await updateProfile({
        full_name: fullName,
        college_name: collegeName,
        department,
        phone,
        is_phone_public: isPhonePublic,
        avatar_url: avatarUrl,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      const file = e.target.files[0];
      const url = await uploadResourceImage(file, user?.id || "profile");
      setAvatarUrl(url);
    } catch (err: any) {
      setError(err.message || "Failed to upload avatar.");
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure? This action is irreversible and deletes your profile.")) {
      await deleteAccount();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Account & Profile Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your verified campus credentials and privacy preferences.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes updated successfully.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="bg-white dark:bg-[#12281e] p-6 sm:p-8 rounded-3xl border border-forest-900/10 dark:border-forest-800 shadow-card space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-6 pb-6 border-b border-slate-100 dark:border-forest-800">
          <div className="relative w-20 h-20 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl overflow-hidden shadow-md">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              fullName.charAt(0) || "U"
            )}
          </div>
          <div className="space-y-1">
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-forest-50 dark:bg-forest-900/60 hover:bg-forest-100 dark:hover:bg-forest-900 text-forest-900 dark:text-emerald-300 rounded-xl text-xs font-semibold border border-forest-900/10 dark:border-forest-700 transition-colors">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Change Avatar</span>
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
            <p className="text-[11px] text-slate-400">JPG, PNG or WebP under 5MB</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-forest-700 bg-white dark:bg-[#0c1f17] text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Email Address (Fixed)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-forest-800 bg-slate-50 dark:bg-forest-950/60 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              College / University
            </label>
            <div className="relative">
              <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-forest-700 bg-white dark:bg-[#0c1f17] text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Major / Department
            </label>
            <input
              type="text"
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-forest-700 bg-white dark:bg-[#0c1f17] text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Contact Phone (Optional)
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-forest-700 bg-white dark:bg-[#0c1f17] text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Privacy Switch */}
          <div className="flex flex-col justify-center pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPhonePublic}
                onChange={(e) => setIsPhonePublic(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Make phone number visible on accepted requests
              </span>
            </label>
            <p className="text-[11px] text-slate-400 pl-6 mt-0.5">
              By default, your phone number remains private.
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-forest-900 hover:bg-forest-950 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </form>

      {/* Danger Zone: Delete Account */}
      <div className="bg-rose-50/50 dark:bg-rose-950/20 rounded-3xl p-6 sm:p-8 border border-rose-200 dark:border-rose-900/60 space-y-4">
        <div>
          <h3 className="text-base font-bold text-rose-900 dark:text-rose-300 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Danger Zone — Delete Account</span>
          </h3>
          <p className="text-xs text-rose-700/80 dark:text-rose-400/80 mt-1 leading-relaxed">
            Permanently delete your LoopSpace account, profile records, and active resource listings. This action cannot be reversed.
          </p>
        </div>

        <button
          onClick={handleDeleteAccount}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
        >
          Delete My Account Permanently
        </button>
      </div>
    </div>
  );
}
