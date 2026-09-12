import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ─── Read env vars from import.meta.env ─────────────────────────────────────
// Vite exposes env vars to the client based on `envPrefix` (vite.config.ts).
// We check two naming conventions in order:
//   1. import.meta.env.SUPABASE_URL  — from Backend settings (no VITE_ prefix,
//      should NOT be encrypted by the hosting platform)
//   2. import.meta.env.VITE_SUPABASE_URL — from Keys tab (VITE_ prefix,
//      may be encrypted by the hosting platform)
const supabaseUrl =
  (import.meta.env.SUPABASE_URL as string | undefined) ??
  (import.meta.env.VITE_SUPABASE_URL as string | undefined);

const supabaseAnonKey =
  (import.meta.env.SUPABASE_ANON_KEY as string | undefined) ??
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined);

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
    const raw = supabaseUrl;
    issues.push(
      raw === undefined
        ? "SUPABASE_URL / VITE_SUPABASE_URL not found in environment"
        : `SUPABASE_URL value is invalid (${raw.length} chars, starts with "${raw.slice(0, 8)}...")`,
    );
  }
  if (!keyIsValid) {
    const raw = supabaseAnonKey;
    issues.push(
      raw === undefined
        ? "SUPABASE_ANON_KEY / VITE_SUPABASE_ANON_KEY not found in environment"
        : `SUPABASE_ANON_KEY value is invalid (${raw.length} chars, starts with "${raw.slice(0, 6)}...")`,
    );
  }
  console.error(
    `[StudyPro] Supabase: ❌ Configuration error\n` +
      issues.map((i) => `  • ${i}`).join("\n") + "\n" +
      `  To fix, set these in the Freebuff Backend settings (plaintext, no VITE_ prefix):\n` +
      `  • SUPABASE_URL       → https://<project-ref>.supabase.co\n` +
      `  • SUPABASE_ANON_KEY  → eyJhbGci... (from Supabase Dashboard → Project Settings → API)`,
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────
export const isSupabaseConfigured = Boolean(urlIsValid && keyIsValid);

export const supabase: SupabaseClient = createClient(
  urlIsValid ? cleanUrl : "https://placeholder.supabase.co",
  keyIsValid ? cleanKey : "placeholder-key",
);
