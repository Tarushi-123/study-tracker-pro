import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Trim whitespace and strip surrounding quotes that some env tools add
const supabaseUrl = rawUrl?.trim().replace(/^['"]|['"]$/g, "");
const supabaseAnonKey = rawKey?.trim().replace(/^['"]|['"]$/g, "");

// Validate URL format
const urlIsValid =
  !!supabaseUrl &&
  (supabaseUrl.startsWith("https://") || supabaseUrl.startsWith("http://")) &&
  supabaseUrl.includes(".supabase.co");

if (supabaseUrl && !urlIsValid) {
  console.error(
    `[StudyPro] VITE_SUPABASE_URL is set but not a valid Supabase Project URL.\n` +
      `  Received: "${supabaseUrl.slice(0, 60)}${supabaseUrl.length > 60 ? "..." : ""}"\n` +
      `  Expected: https://<project-ref>.supabase.co\n` +
      `  ⚠️  This looks like it might be the API key. Make sure the URL field has the Project URL, not the anon key.`,
  );
}

export const isSupabaseConfigured = Boolean(urlIsValid && supabaseAnonKey);

export const supabase: SupabaseClient = createClient(
  urlIsValid ? supabaseUrl : "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
);
