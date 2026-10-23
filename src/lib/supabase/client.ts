import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "./config";

export function createClient() {
  if (!isSupabaseConfigured()) {
    // Return a dummy client proxy or null if not configured to prevent crashes
    return createBrowserClient(
      "https://dummy-project.supabase.co",
      "dummy-anon-key"
    );
  }

  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
