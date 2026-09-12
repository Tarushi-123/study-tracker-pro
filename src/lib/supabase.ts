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

// Safe diagnostic — logs presence/format only, never exposes actual values
console.log(
  "[StudyPro] Env check →",
  `VITE_SUPABASE_URL: ${rawUrl === undefined ? "❌ MISSING (undefined)" : rawUrl === "" ? "❌ EMPTY STRING" : supabaseUrl && urlIsValid ? "✅ valid URL" : `⚠️ present but invalid (${rawUrl.length} chars, starts with "${rawUrl.slice(0, 8)}...")`}`,
  `| VITE_SUPABASE_ANON_KEY: ${rawKey === undefined ? "❌ MISSING (undefined)" : rawKey === "" ? "❌ EMPTY STRING" : supabaseAnonKey && supabaseAnonKey.length > 20 ? "✅ present" : "⚠️ present but looks too short"}`,
);

if (supabaseUrl && !urlIsValid) {
  console.error(
    `[StudyPro] VITE_SUPABASE_URL is set but not a valid Supabase Project URL.\n` +
      `  Expected format: https://<project-ref>.supabase.co\n` +
      `  ⚠️  This looks like it might be the wrong value. Make sure you pasted the Project URL, not the anon key.`,
  );
}

export const isSupabaseConfigured = Boolean(urlIsValid && supabaseAnonKey);

export const supabase: SupabaseClient = createClient(
  urlIsValid ? supabaseUrl : "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
);
