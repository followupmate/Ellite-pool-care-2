"use client"

import { useEffect, useState } from "react"
import {
  Droplets,
  Thermometer,
  Zap,
  FlaskConical,
  Settings,
  CalendarDays,
  TrendingUp,
  Calculator,
  Sparkles,
  BookOpen,
  ChevronRight,
} from "lucide-react"
import { ReadingCard } from "@/components/reading-card"
import { StatusBadge } from "@/components/status-badge"
import { WarningCard } from "@/components/warning-card"
import { BottomNav } from "@/components/bottom-nav"
import { useRouter } from "next/navigation"
import { initFromSupabase, getLatestEntry, computeStatus } from "@/lib/storage"
import type { LogEntry, PoolData } from "@/lib/types"

function getReadingStatus(
  value: string | undefined,
  type: "pH" | "cl" | "temp" | "redox"
): "optimal" | "warning" | "danger" {
  if (!value) return "optimal"
  const n = parseFloat(value)
  if (isNaN(n)) return "optimal"
  if (type === "pH") {
    if (n < 6.8 || n > 7.8) return "danger"
    if (n < 7.0 || n > 7.6) return "warning"
  } else if (type === "cl") {
    if (n < 0.3 || n > 3.0) return "danger"
    if (n < 0.5 || n > 2.5) return "warning"
  } else if (type === "redox") {
    if (n < 600) return "danger"
    if (n < 650) return "warning"
  }
  return "optimal"
}

function getReadingStatusText(status: "optimal" | "warning" | "danger"): string {
  if (status === "danger") return "Mimo normy"
  if (status === "warning") return "Odchýlka"
  return "V norme"
}

export default function HomePage() {
  const router = useRouter()
  const [entry, setEntry] = useState<LogEntry | null>(null)
  const [poolData, setPoolData] = useState<PoolData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initFromSupabase().then(({ entries, poolData: pool }) => {
      setEntry(getLatestEntry(entries))
      setPoolData(pool)
      setLoading(false)
    })
  }, [])

  const pH = entry?.tester?.pH ?? entry?.aseco?.pH ?? "—"
  const cl = entry?.tester?.Cl ?? "—"
  const temp = entry?.tester?.temp ?? "—"
  const redox = entry?.aseco?.redox ?? "—"

  const pHStatus = getReadingStatus(entry?.tester?.pH ?? entry?.aseco?.pH, "pH")
  const clStatus = getReadingStatus(entry?.tester?.Cl, "cl")
  const redoxStatus = getReadingStatus(entry?.aseco?.redox, "redox")

  const overallStatus = computeStatus(entry)
  const highCl =
    entry?.tester?.Cl !== undefined && parseFloat(entry.tester.Cl) > 2.5
  const phWarning =
    entry?.tester?.pH !== undefined &&
    (parseFloat(entry.tester.pH) > 7.4 || parseFloat(entry.tester.pH) < 7.0)

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Status Bar Spacer */}
      <div className="h-12" />

      {/* Header */}
      <header className="px-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusBadge status="live" text="OPERATIONAL" />
            <StatusBadge status={overallStatus === "ok" ? "ok" : "warning"} text="Live" />
          </div>
          <button
            onClick={() => router.push("/nastavenia")}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center"
          >
            <Settings className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="mt-4">
          <h1 className="text-2xl font-bold text-foreground">
            {poolData?.name ?? "Môj bazén"}
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {poolData?.volume ? `${poolData.volume} m³` : "—"}
            {loading && (
              <span className="ml-2 text-xs text-muted-foreground/50">
                načítavam...
              </span>
            )}
          </p>
        </div>
      </header>

      {/* Pool Photo Card */}
      <section className="px-5 pb-4">
        <div className="relative bg-gradient-to-br from-[#00E5CC] to-[#00B4A2] rounded-[20px] h-40 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white/30 text-6xl font-bold">POOL</div>
          </div>
          {entry && (
            <div className="absolute top-3 right-3 bg-white/20 rounded-full px-3 py-1">
              <span className="text-white text-xs font-medium">
                {entry.date} {entry.time}
              </span>
            </div>
          )}
          <svg
            className="absolute bottom-0 left-0 right-0 w-full"
            viewBox="0 0 400 50"
            preserveAspectRatio="none"
          >
            <path
              d="M0,25 Q50,0 100,25 T200,25 T300,25 T400,25 L400,50 L0,50 Z"
              fill="rgba(255,255,255,0.2)"
            />
            <path
              d="M0,30 Q50,10 100,30 T200,30 T300,30 T400,30 L400,50 L0,50 Z"
              fill="rgba(255,255,255,0.15)"
            />
          </svg>
        </div>
      </section>

      {/* Readings Grid */}
      <section className="px-5 pb-4">
        <div className="grid grid-cols-2 gap-3">
          <ReadingCard
            icon={<FlaskConical className="w-5 h-5 text-white" />}
            iconBgColor="bg-[#5856D6]"
            label="pH"
            value={pH}
            unit=""
            status={pHStatus}
            statusText={getReadingStatusText(pHStatus)}
          />
          <ReadingCard
            icon={<Droplets className="w-5 h-5 text-white" />}
            iconBgColor="bg-[#00E5CC]"
            label="Chlór"
            value={cl}
            unit={cl !== "—" ? "ppm" : ""}
            status={clStatus}
            statusText={getReadingStatusText(clStatus)}
          />
          <ReadingCard
            icon={<Thermometer className="w-5 h-5 text-white" />}
            iconBgColor="bg-[#FF9500]"
            label="Teplota"
            value={temp}
            unit={temp !== "—" ? "°C" : ""}
            status="optimal"
            statusText="V norme"
          />
          <ReadingCard
            icon={<Zap className="w-5 h-5 text-white" />}
            iconBgColor="bg-[#FF2D55]"
            label="Redox"
            value={redox}
            unit={redox !== "—" ? "mV" : ""}
            status={redoxStatus}
            statusText={getReadingStatusText(redoxStatus)}
          />
        </div>
      </section>

      {/* Warning Cards — len ak reálne existujú */}
      {(highCl || phWarning) && (
        <section className="px-5 pb-4 space-y-3">
          {highCl && (
            <WarningCard
              type="warning"
              title="Vysoký chlór — znížte dávkovanie"
            />
          )}
          {phWarning && (
            <WarningCard
              type="prediction"
              title="pH mimo optimálneho rozmedzia"
              description="Skontrolujte a upravte hodnotu pH"
            />
          )}
        </section>
      )}

      {/* Navigation List */}
      <section className="px-5 pb-6">
        <div className="bg-card rounded-[20px] overflow-hidden divide-y divide-border">
          <NavItem
            icon={<TrendingUp className="w-5 h-5 text-white" />}
            iconBgColor="bg-[#00E5CC]"
            label="Prehľad meraní"
            onClick={() => router.push("/analytika")}
          />
          <NavItem
            icon={<CalendarDays className="w-5 h-5 text-white" />}
            iconBgColor="bg-[#007AFF]"
            label="Denník"
            onClick={() => router.push("/dennik")}
          />
          <NavItem
            icon={<TrendingUp className="w-5 h-5 text-white" />}
            iconBgColor="bg-[#34C759]"
            label="Analytika"
            onClick={() => router.push("/analytika")}
          />
          <NavItem
            icon={<Calculator className="w-5 h-5 text-white" />}
            iconBgColor="bg-[#FF9500]"
            label="Kalkulačka"
            onClick={() => {}}
          />
          <NavItem
            icon={<Sparkles className="w-5 h-5 text-white" />}
            iconBgColor="bg-[#5856D6]"
            label="AI Asistent"
            onClick={() => router.push("/ai-asistent")}
          />
          <NavItem
            icon={<BookOpen className="w-5 h-5 text-white" />}
            iconBgColor="bg-[#FF3B30]"
            label="Príručka"
            onClick={() => {}}
          />
        </div>
      </section>

      <BottomNav />
    </div>
  )
}

function NavItem({
  icon,
  iconBgColor,
  label,
  onClick,
}: {
  icon: React.ReactNode
  iconBgColor: string
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors text-left"
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconBgColor}`}
      >
        {icon}
      </div>
      <span className="flex-1 text-foreground font-medium">{label}</span>
      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
    </button>
  )
}
