import { getSupabaseClient } from "./supabase"
import type { LogEntry, PoolData } from "./types"

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

export function loadFromStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function saveToLocalStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full or unavailable — ignore
  }
}

// ---------------------------------------------------------------------------
// Log entries
// ---------------------------------------------------------------------------

const LOG_KEY = "epc_log_entries"
const POOL_KEY = "epc_pool_data"

export async function saveToStorage(entry: LogEntry): Promise<void> {
  // Optimistically update localStorage
  const existing = loadFromStorage<LogEntry[]>(LOG_KEY) ?? []
  const updated = [entry, ...existing]
  saveToLocalStorage(LOG_KEY, updated)

  // Persist to Supabase if configured
  const client = getSupabaseClient()
  if (!client) return
  try {
    const { error } = await client
      .from("ep_log_entries")
      .upsert({ id: entry.id, data: entry })
    if (error) console.error("[storage] saveToStorage error:", error.message, error.details)
  } catch (e) {
    console.error("[storage] saveToStorage exception:", e)
  }
}

export async function deleteEntry(id: string): Promise<void> {
  const existing = loadFromStorage<LogEntry[]>(LOG_KEY) ?? []
  saveToLocalStorage(
    LOG_KEY,
    existing.filter((e) => e.id !== id)
  )

  const client = getSupabaseClient()
  if (!client) return
  try {
    const { error } = await client.from("ep_log_entries").delete().eq("id", id)
    if (error) console.error("[storage] deleteEntry error:", error.message)
  } catch (e) {
    console.error("[storage] deleteEntry exception:", e)
  }
}

// ---------------------------------------------------------------------------
// Supabase → localStorage sync
// ---------------------------------------------------------------------------

export async function initFromSupabase(): Promise<{
  entries: LogEntry[]
  poolData: PoolData | null
}> {
  let entries: LogEntry[] = loadFromStorage<LogEntry[]>(LOG_KEY) ?? []
  let poolData: PoolData | null = loadFromStorage<PoolData>(POOL_KEY)

  const client = getSupabaseClient()
  if (!client) {
    return { entries, poolData }
  }

  try {
    const [logRes, poolRes] = await Promise.all([
      client
        .from("ep_log_entries")
        .select("id, data")
        // Sort by inserted row id descending — avoids jsonb path ordering issues
        .order("id", { ascending: false })
        .limit(100),
      client.from("ep_pool_data").select("*").limit(1).single(),
    ])

    console.log("[storage] logRes:", logRes.error ?? `${logRes.data?.length ?? 0} rows`)
    console.log("[storage] poolRes:", poolRes.error ?? "ok")

    if (logRes.error) {
      console.error("[storage] initFromSupabase logRes error:", logRes.error.message, logRes.error.details)
    } else if (logRes.data && logRes.data.length > 0) {
      entries = logRes.data
        .map((row: { id: string; data: LogEntry }) => row.data)
        .filter((e): e is LogEntry => !!e && typeof e === "object" && "id" in e)
      saveToLocalStorage(LOG_KEY, entries)
    }

    if (poolRes.error) {
      // PGRST116 = no rows — not a real error when pool not yet configured
      if (poolRes.error.code !== "PGRST116") {
        console.error("[storage] initFromSupabase poolRes error:", poolRes.error.message)
      }
    } else if (poolRes.data) {
      poolData = poolRes.data as PoolData
      saveToLocalStorage(POOL_KEY, poolData)
    }
  } catch (e) {
    console.error("[storage] initFromSupabase exception:", e)
  }

  return { entries, poolData }
}

// ---------------------------------------------------------------------------
// Derived helpers
// ---------------------------------------------------------------------------

export function getLatestEntry(entries: LogEntry[]): LogEntry | null {
  if (!entries.length) return null
  return entries.reduce((a, b) =>
    new Date(a.createdAt) > new Date(b.createdAt) ? a : b
  )
}

export function computeStatus(
  entry: LogEntry | null
): "ok" | "warning" | "danger" {
  if (!entry) return "ok"
  const pH = parseFloat(entry.tester?.pH ?? entry.aseco?.pH ?? "7.2")
  const cl = parseFloat(entry.tester?.Cl ?? "1.0")
  if (pH < 6.8 || pH > 7.8 || cl < 0.3 || cl > 3.0) return "danger"
  if (pH < 7.0 || pH > 7.6 || cl < 0.5 || cl > 2.5) return "warning"
  return "ok"
}
