/**
 * SAFE DIAGNOSTIC — runs inside Vite's module system.
 * Never prints actual values, only metadata about presence and format.
 */
const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const results: string[] = [];

// Check VITE_SUPABASE_URL
if (rawUrl === undefined) {
  results.push("VITE_SUPABASE_URL: ❌ MISSING — import.meta.env returns undefined. The variable was NOT injected by Vite.");
} else if (rawUrl === "") {
  results.push("VITE_SUPABASE_URL: ❌ EMPTY STRING");
} else {
  const trimmed = rawUrl.trim().replace(/^['"]|['"]$/g, "");
  if (!trimmed.startsWith("https://") && !trimmed.startsWith("http://")) {
    results.push(`VITE_SUPABASE_URL: ⚠️ PRESENT but starts with "${trimmed.slice(0, 8)}..." (not https://). Length=${trimmed.length}`);
  } else if (!trimmed.includes(".supabase.co")) {
    results.push(`VITE_SUPABASE_URL: ⚠️ PRESENT as a URL but missing ".supabase.co". Length=${trimmed.length}`);
  } else {
    results.push(`VITE_SUPABASE_URL: ✅ Present and looks like a valid Supabase URL (length=${trimmed.length})`);
  }
}

// Check VITE_SUPABASE_ANON_KEY
if (rawKey === undefined) {
  results.push("VITE_SUPABASE_ANON_KEY: ❌ MISSING — import.meta.env returns undefined.");
} else if (rawKey === "") {
  results.push("VITE_SUPABASE_ANON_KEY: ❌ EMPTY STRING");
} else {
  const trimmed = rawKey.trim();
  if (trimmed.startsWith("eyJ")) {
    results.push(`VITE_SUPABASE_ANON_KEY: ✅ Present, starts with "eyJ" (looks like a JWT). Length=${trimmed.length}`);
  } else {
    results.push(`VITE_SUPABASE_ANON_KEY: ⚠️ Present but starts with "${trimmed.slice(0, 6)}..." Length=${trimmed.length}`);
  }
}

// Log all results
console.log("[StudyPro Env Diagnostic]");
results.forEach((r) => console.log("  " + r));

// Also list ALL VITE_ env vars (names only, not values)
const allViteKeys = Object.keys(import.meta.env).filter((k) => k.startsWith("VITE_"));
console.log(`  All VITE_* keys available: [${allViteKeys.join(", ")}]`);

export {};
