import { createClient, SupabaseClient } from "@supabase/supabase-js"

let _client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window === "undefined") return null

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Log env status — helps diagnose missing/empty vars on Vercel
  console.log("[supabase] NEXT_PUBLIC_SUPABASE_URL:", url ? `${url.slice(0, 30)}…` : "MISSING")
  console.log("[supabase] NEXT_PUBLIC_SUPABASE_ANON_KEY:", key ? `set (${key.length} chars)` : "MISSING")

  // Treat empty string the same as missing
  if (!url?.trim() || !key?.trim()) {
    console.warn("[supabase] Client not created — env vars not configured")
    return null
  }

  if (!_client) {
    // Strip any trailing /rest/v1 the env var might accidentally contain —
    // createClient appends it internally, so a double path would result in
    // requests going to /rest/v1/rest/v1/...
    const cleanUrl = url.trim().replace(/\/rest\/v1\/?$/, "")
    _client = createClient(cleanUrl, key.trim())
    console.log("[supabase] Client created for", cleanUrl.slice(0, 30) + "…")
  }

  return _client
}

// Convenience: null if env not configured
export const supabase = {
  from: (table: string) => getSupabaseClient()?.from(table),
}
