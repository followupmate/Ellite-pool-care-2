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
    await client.from("ep_log_entries").upsert({ id: entry.id, data: entry })
  } catch {
    // offline — data stays in localStorage until next sync
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
    await client.from("ep_log_entries").delete().eq("id", id)
  } catch {
    // offline
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
        .order("data->createdAt", { ascending: false })
        .limit(100),
      client.from("ep_pool_data").select("*").limit(1).single(),
    ])

    if (logRes.data && logRes.data.length > 0) {
      entries = logRes.data.map(
        (row: { id: string; data: LogEntry }) => row.data
      )
      saveToLocalStorage(LOG_KEY, entries)
    }

    if (poolRes.data) {
      poolData = poolRes.data as PoolData
      saveToLocalStorage(POOL_KEY, poolData)
    }
  } catch {
    // network error — use cached data
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
  const pH = parseFloat(entry.tester.pH ?? entry.aseco.pH ?? "7.2")
  const cl = parseFloat(entry.tester.Cl ?? "1.0")
  if (pH < 6.8 || pH > 7.8 || cl < 0.3 || cl > 3.0) return "danger"
  if (pH < 7.0 || pH > 7.6 || cl < 0.5 || cl > 2.5) return "warning"
  return "ok"
}
