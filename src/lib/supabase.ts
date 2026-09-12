import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ─── Read from import.meta.env ──────────────────────────────────────────────
// import.meta.env.SUPABASE_URL and import.meta.env.SUPABASE_ANON_KEY are
// injected at build/dev time by vite.config.ts → define, which reads from
// env.json in the project root.
const supabaseUrl = import.meta.env.SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY as string | undefined;

// ─── Normalize ───────────────────────────────────────────────────────────────
const cleanUrl = supabaseUrl?.trim().replace(/^['"]|['"]$/g, "");
const cleanKey = supabaseAnonKey?.trim().replace(/^['"]|['"]$/g, "");

// ─── Validate ────────────────────────────────────────────────────────────────
const urlIsValid =
  !!cleanUrl &&
  cleanUrl.startsWith("https://") &&
  cleanUrl.includes(".supabase.co");

const keyIsValid =
  !!cleanKey &&
  cleanKey.length > 50 &&
  cleanKey.startsWith("eyJ");

// ─── Diagnostic (never prints actual values) ─────────────────────────────────
if (urlIsValid && keyIsValid) {
  console.log("[StudyPro] Supabase: ✅ connected");
} else {
  const issues: string[] = [];
  if (!urlIsValid) {
    issues.push(
      supabaseUrl === undefined
        ? "SUPABASE_URL not defined in env.json"
        : `SUPABASE_URL is invalid (${supabaseUrl.length} chars, starts with "${supabaseUrl.slice(0, 8)}...")`,
    );
  }
  if (!keyIsValid) {
    issues.push(
      supabaseAnonKey === undefined
        ? "SUPABASE_ANON_KEY not defined in env.json"
        : `SUPABASE_ANON_KEY is invalid (${supabaseAnonKey.length} chars, starts with "${supabaseAnonKey.slice(0, 6)}...")`,
    );
  }
  console.error(
    `[StudyPro] Supabase: ❌ Configuration error\n` +
      issues.map((i) => `  • ${i}`).join("\n") + "\n" +
      `  To fix: Paste your Supabase credentials into env.json at the project root.\n` +
      `  Get values from: Supabase Dashboard → Project Settings → API`,
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────
export const isSupabaseConfigured = Boolean(urlIsValid && keyIsValid);

export const supabase: SupabaseClient = createClient(
  urlIsValid ? cleanUrl : "https://placeholder.supabase.co",
  keyIsValid ? cleanKey : "placeholder-key",
);
