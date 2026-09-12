import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ─── Read directly from Vite's frontend environment ──────────────────────────
// VITE_ prefixed variables are the ONLY way Vite exposes env vars to the client.
// These must be set in .env.local or injected by the hosting platform as
// PLAINTEXT values — not encrypted ciphertext.
const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// ─── Normalize ───────────────────────────────────────────────────────────────
// Trim whitespace and strip surrounding quotes that some env tools add.
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

// ─── Diagnostic (safe — never prints actual values) ──────────────────────────
function logStatus(label: string, raw: string | undefined, isValid: boolean) {
  if (raw === undefined) {
    console.error(`[StudyPro] ${label}: ❌ NOT SET — variable is undefined.`);
  } else if (raw === "") {
    console.error(`[StudyPro] ${label}: ❌ EMPTY STRING`);
  } else if (isValid) {
    console.log(`[StudyPro] ${label}: ✅ valid`);
  } else {
    console.error(
      `[StudyPro] ${label}: ❌ INVALID — received ${raw.length} chars starting with "${raw.slice(0, 8)}...". ` +
        `Expected ${label === "VITE_SUPABASE_URL" ? "https://<ref>.supabase.co" : "eyJ... (JWT from Supabase)"}. ` +
        `⚠️  The hosting platform may be injecting encrypted values instead of plaintext.`,
    );
  }
}

logStatus("VITE_SUPABASE_URL", rawUrl, urlIsValid);
logStatus("VITE_SUPABASE_ANON_KEY", rawKey, keyIsValid);

// ─── Throw on misconfiguration ───────────────────────────────────────────────
if (!urlIsValid || !keyIsValid) {
  const missing: string[] = [];
  if (!urlIsValid) missing.push("VITE_SUPABASE_URL");
  if (!keyIsValid) missing.push("VITE_SUPABASE_ANON_KEY");

  console.error(
    `[StudyPro] Initialization failed — invalid or missing environment variables: ${missing.join(", ")}.\n` +
      `  How to fix:\n` +
      `  1. Go to Supabase Dashboard → Project Settings → API\n` +
      `  2. Copy Project URL (https://xxxxx.supabase.co) → set as VITE_SUPABASE_URL\n` +
      `  3. Copy anon public key (eyJ...) → set as VITE_SUPABASE_ANON_KEY\n` +
      `  4. Make sure the hosting platform injects PLAINTEXT values, not encrypted ciphertext.\n` +
      `  5. Restart the Vite dev server after changing env vars.`,
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────
export const isSupabaseConfigured = Boolean(urlIsValid && keyIsValid);

export const supabase: SupabaseClient = createClient(
  urlIsValid ? supabaseUrl : "https://placeholder.supabase.co",
  keyIsValid ? supabaseAnonKey : "placeholder-key",
);
