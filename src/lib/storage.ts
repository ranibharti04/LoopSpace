import { createClient } from "./supabase/client";
import { isSupabaseConfigured } from "./supabase/config";

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): ImageValidationResult {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Only JPG, PNG, and WebP image formats are accepted.",
    };
  }

  const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
  if (file.size > maxSizeInBytes) {
    return {
      valid: false,
      error: "Image file size exceeds the 5MB limit.",
    };
  }

  return { valid: true };
}

export async function uploadResourceImage(file: File, userId: string): Promise<string> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  if (!isSupabaseConfigured()) {
    // In demo / fallback mode, generate a local object URL or data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  const supabase = createClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `resources/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("resource-images")
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(`Failed to upload image: ${uploadError.message}`);
  }

  const { data } = supabase.storage
    .from("resource-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}
