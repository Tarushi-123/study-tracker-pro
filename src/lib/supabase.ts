import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ─── Read from Vite frontend environment ─────────────────────────────────────
// import.meta.env.VITE_SUPABASE_URL and import.meta.env.VITE_SUPABASE_ANON_KEY
// are populated by two sources (checked in this order):
//   1. vite.config.ts `define` → injects from process.env.SUPABASE_URL / SUPABASE_ANON_KEY
//      (backend plaintext values, not encrypted by the hosting platform)
//   2. Vite's built-in env loading → reads VITE_SUPABASE_URL from .env.local or
//      the hosting platform's VITE_-prefixed injection (may be encrypted)
const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// ─── Normalize ───────────────────────────────────────────────────────────────
const supabaseUrl = rawUrl?.trim().replace(/^['"]|['"]$/g, "");
const supabaseAnonKey = rawKey?.trim().replace(/^['"]|['"]$/g, "");

// ─── Validate ────────────────────────────────────────────────────────────────
const urlIsValid =
  !!supabaseUrl &&
  supabaseUrl.startsWith("https://") &&
  supabaseUrl.includes(".supabase.co");

const keyIsValid =
  !!supabaseAnonKey &&
  supabaseAnonKey.length > 50 &&
  supabaseAnonKey.startsWith("eyJ");

// ─── Safe diagnostic (never prints actual values) ────────────────────────────
if (urlIsValid && keyIsValid) {
  console.log("[StudyPro] Supabase: ✅ connected");
} else {
  const issues: string[] = [];
  if (!urlIsValid) {
    issues.push(
      rawUrl === undefined
        ? "VITE_SUPABASE_URL is undefined (not set in env or Backend settings)"
        : `VITE_SUPABASE_URL is invalid (${rawUrl.length} chars, starts with "${rawUrl.slice(0, 8)}...")`,
    );
  }
  if (!keyIsValid) {
    issues.push(
      rawKey === undefined
        ? "VITE_SUPABASE_ANON_KEY is undefined (not set in env or Backend settings)"
        : `VITE_SUPABASE_ANON_KEY is invalid (${rawKey.length} chars, starts with "${rawKey.slice(0, 6)}...")`,
    );
  }
  console.error(
    `[StudyPro] Supabase: ❌ Configuration error\n` +
      issues.map((i) => `  • ${i}`).join("\n") + "\n" +
      `  Fix: Set SUPABASE_URL and SUPABASE_ANON_KEY in Backend settings (plaintext).\n` +
      `  These are injected into the frontend via vite.config.ts → define.\n` +
      `  Get values from: Supabase Dashboard → Project Settings → API`,
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────
export const isSupabaseConfigured = Boolean(urlIsValid && keyIsValid);

export const supabase: SupabaseClient = createClient(
  urlIsValid ? supabaseUrl : "https://placeholder.supabase.co",
  keyIsValid ? supabaseAnonKey : "placeholder-key",
);
