"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { ResourceCategory, ResourceCondition, SharingType } from "@/types";
import { createResource } from "@/lib/data-service";
import { uploadResourceImage, validateImageFile } from "@/lib/storage";
import {
  UploadCloud,
  X,
  AlertCircle,
  PlusCircle,
  CheckCircle2,
  Calendar,
  MapPin,
  Tag,
  Package,
} from "lucide-react";

export default function CreateResourcePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ResourceCategory>("Books & Notes");
  const [sharingType, setSharingType] = useState<SharingType>("lend");
  const [condition, setCondition] = useState<ResourceCondition>("good");
  const [quantity, setQuantity] = useState(1);
  const [pickupLocation, setPickupLocation] = useState("Campus Library North Desk");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableUntil, setAvailableUntil] = useState("");

  const [images, setImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const validation = validateImageFile(file);

    if (!validation.valid) {
      setError(validation.error || "Invalid image.");
      return;
    }

    try {
      setUploadingImage(true);
      setError(null);
      const url = await uploadResourceImage(file, user?.id || "guest");
      setImages((prev) => [...prev, url]);
    } catch (err: any) {
      setError(err.message || "Failed to process image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("Please sign in or select a demo user persona before posting.");
      return;
    }

    if (quantity < 1) {
      setError("Quantity must be at least 1.");
      return;
    }

    if (availableFrom && availableUntil && new Date(availableUntil) < new Date(availableFrom)) {
      setError("Available until date must be after available from date.");
      return;
    }

    try {
      setIsSubmitting(true);
      const newRes = await createResource({
        title,
        description,
        category,
        sharing_type: sharingType,
        condition,
        quantity,
        images: images.length > 0 ? images : [
          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
        ],
        pickup_location: pickupLocation,
        available_from: availableFrom || undefined,
        available_until: availableUntil || undefined,
        owner_id: user.id,
        status: "available",
      });

      router.push(`/resources/${newRes.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create resource.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          List a Campus Resource
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Lend, donate, or swap items with students across your university.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#12281e] p-6 sm:p-8 rounded-3xl border border-forest-900/10 dark:border-forest-800 shadow-card space-y-6">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Resource Title <span className="text-emerald-600">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. TI-84 Plus CE Graphing Calculator or Campbell Biology 11th Ed"
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-forest-700 bg-white dark:bg-[#0c1f17] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
        </div>

        {/* Category & Sharing Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Category <span className="text-emerald-600">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ResourceCategory)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-forest-700 bg-white dark:bg-[#0c1f17] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 shadow-sm"
            >
              <option value="Books & Notes">Books & Notes</option>
              <option value="Electronics">Electronics</option>
              <option value="Lab Equipment">Lab Equipment</option>
              <option value="Sports & Fitness">Sports & Fitness</option>
              <option value="Stationery">Stationery</option>
              <option value="Decor & Events">Decor & Events</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Sharing Mode <span className="text-emerald-600">*</span>
            </label>
            <select
              value={sharingType}
              onChange={(e) => setSharingType(e.target.value as SharingType)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-forest-700 bg-white dark:bg-[#0c1f17] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 shadow-sm"
            >
              <option value="lend">Lend Temporarily (Borrow & Return)</option>
              <option value="donate">Give Away (Free Donation)</option>
              <option value="exchange">Exchange / Swap for Item</option>
              <option value="request">Seeking / Post a Need</option>
            </select>
          </div>
        </div>

        {/* Condition & Quantity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Item Condition <span className="text-emerald-600">*</span>
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as ResourceCondition)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-forest-700 bg-white dark:bg-[#0c1f17] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 shadow-sm"
            >
              <option value="new">Brand New (Unused)</option>
              <option value="like_new">Like New (Minimal Wear)</option>
              <option value="good">Good (Fully Functional)</option>
              <option value="usable">Usable (Cosmetic Wear)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Quantity
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-forest-700 bg-white dark:bg-[#0c1f17] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Description & Course Relevance <span className="text-emerald-600">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mention edition, course code (e.g. CS201), included cables/accessories, and any special care instructions..."
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-forest-700 bg-white dark:bg-[#0c1f17] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
        </div>

        {/* Pickup Location */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Campus Pickup Location <span className="text-emerald-600">*</span>
          </label>
          <input
            type="text"
            required
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            placeholder="e.g. Campus Library North Desk, Engineering Quad Hall A..."
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-forest-700 bg-white dark:bg-[#0c1f17] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
        </div>

        {/* Availability Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Available From
            </label>
            <input
              type="date"
              value={availableFrom}
              onChange={(e) => setAvailableFrom(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-forest-700 bg-white dark:bg-[#0c1f17] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Available Until
            </label>
            <input
              type="date"
              value={availableUntil}
              onChange={(e) => setAvailableUntil(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-forest-700 bg-white dark:bg-[#0c1f17] text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
          </div>
        </div>

        {/* Image Upload & Previews */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Upload Item Photos (JPG, PNG, WebP &lt; 5MB)
          </label>

          <div className="flex flex-wrap gap-3 items-center">
            {images.map((img, i) => (
              <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 dark:border-forest-700 shadow-subtle group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-rose-600 text-white rounded-full transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 dark:border-forest-700 hover:border-emerald-500 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-forest-900/20">
              <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-emerald-500" />
              <span className="text-[10px] text-slate-500 font-semibold mt-1">
                {uploadingImage ? "Loading..." : "Add Photo"}
              </span>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageFileChange}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-forest-800">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 border border-slate-200 dark:border-forest-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-forest-900/40"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !title || !description}
            className="px-6 py-2.5 bg-forest-900 hover:bg-forest-950 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isSubmitting ? "Publishing Listing..." : "Publish Listing"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
