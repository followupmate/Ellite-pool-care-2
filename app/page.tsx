"use client"

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

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Status Bar Spacer */}
      <div className="h-12" />

      {/* Header */}
      <header className="px-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusBadge status="live" text="OPERATIONAL" />
            <StatusBadge status="ok" text="Live" />
          </div>
          <button
            onClick={() => router.push("/nastavenia")}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center"
          >
            <Settings className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="mt-4">
          <h1 className="text-2xl font-bold text-foreground">Fun 74</h1>
          <p className="text-muted-foreground text-sm mt-0.5">35 m³</p>
        </div>
      </header>

      {/* Pool Photo Card */}
      <section className="px-5 pb-4">
        <div className="relative bg-gradient-to-br from-[#00E5CC] to-[#00B4A2] rounded-[20px] h-40 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white/30 text-6xl font-bold">POOL</div>
          </div>
          {/* Wave decoration */}
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
            value="7.4"
            unit=""
            status="optimal"
            statusText="V norme"
          />
          <ReadingCard
            icon={<Droplets className="w-5 h-5 text-white" />}
            iconBgColor="bg-[#00E5CC]"
            label="Chlór"
            value="2.0"
            unit="ppm"
            status="warning"
            statusText="Odchýlka"
          />
          <ReadingCard
            icon={<Thermometer className="w-5 h-5 text-white" />}
            iconBgColor="bg-[#FF9500]"
            label="Teplota"
            value="29.3"
            unit="°C"
            status="optimal"
            statusText="V norme"
          />
          <ReadingCard
            icon={<Zap className="w-5 h-5 text-white" />}
            iconBgColor="bg-[#FF2D55]"
            label="Redox"
            value="743"
            unit="mV"
            status="optimal"
            statusText="V norme"
          />
        </div>
      </section>

      {/* Warning Cards */}
      <section className="px-5 pb-4 space-y-3">
        <WarningCard
          type="warning"
          title="Vysoký chlór — znížte dávkovanie"
        />
        <WarningCard
          type="prediction"
          title="pH prekročí optimum o 2 dni"
          description="Na základe aktuálneho trendu"
        />
      </section>

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
