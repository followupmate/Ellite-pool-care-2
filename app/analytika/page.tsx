"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  Activity,
  Beaker,
  CheckCircle2,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { BottomNav } from "@/components/bottom-nav"
import { WarningCard } from "@/components/warning-card"
import { cn } from "@/lib/utils"

const phData = [
  { day: "Po", value: 7.2 },
  { day: "Ut", value: 7.35 },
  { day: "St", value: 7.4 },
  { day: "Št", value: 7.45 },
  { day: "Pi", value: 7.38 },
  { day: "So", value: 7.42 },
  { day: "Ne", value: 7.4 },
]

const correlationData = [
  { cl: 1.5, redox: 680 },
  { cl: 1.8, redox: 710 },
  { cl: 2.0, redox: 743 },
  { cl: 2.2, redox: 760 },
  { cl: 2.5, redox: 785 },
]

const chemistryData = [
  { month: "Jan", salt: 12, phMinus: 3, algicide: 2 },
  { month: "Feb", salt: 8, phMinus: 4, algicide: 1 },
  { month: "Mar", salt: 15, phMinus: 2, algicide: 3 },
  { month: "Apr", salt: 10, phMinus: 5, algicide: 2 },
]

const analyticsItems = [
  {
    id: "maintenance",
    icon: CheckCircle2,
    iconBgColor: "bg-[#34C759]",
    label: "Semafor údržby",
    subtitle: "Kontrola stavu",
  },
  {
    id: "ph-trend",
    icon: TrendingUp,
    iconBgColor: "bg-[#5856D6]",
    label: "pH trend",
    subtitle: "Posledných 7 dní",
  },
  {
    id: "correlation",
    icon: Activity,
    iconBgColor: "bg-[#00E5CC]",
    label: "Cl ↔ Redox korelácia",
    subtitle: "Analýza vzťahu",
  },
  {
    id: "chemistry",
    icon: Beaker,
    iconBgColor: "bg-[#FF9500]",
    label: "Spotreba chémie",
    subtitle: "Mesačný prehľad",
  },
]

export default function AnalyticsPage() {
  const router = useRouter()
  const [selectedChart, setSelectedChart] = useState<string | null>(null)

  const renderChart = () => {
    switch (selectedChart) {
      case "ph-trend":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">pH Trend</h3>
              <span className="text-sm text-muted-foreground">
                Posledných 7 dní
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={phData}>
                  <defs>
                    <linearGradient id="phGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E5CC" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00E5CC" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8E8E93", fontSize: 12 }}
                  />
                  <YAxis
                    domain={[7.0, 7.6]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8E8E93", fontSize: 12 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-card rounded-lg p-2 border border-border">
                            <p className="text-sm font-semibold text-foreground">
                              pH: {payload[0].value}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#00E5CC"
                    strokeWidth={3}
                    fill="url(#phGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-3 h-3 rounded-full bg-[#00E5CC]" />
              <span>Optimálne rozmedzie: 7.2 - 7.6</span>
            </div>
          </div>
        )
      case "correlation":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">
                Cl ↔ Redox korelácia
              </h3>
              <span className="text-sm text-muted-foreground">
                Lineárny vzťah
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={correlationData}>
                  <defs>
                    <linearGradient
                      id="correlationGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#00E5CC" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00E5CC" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="cl"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8E8E93", fontSize: 12 }}
                    label={{
                      value: "Cl (ppm)",
                      position: "bottom",
                      fill: "#8E8E93",
                    }}
                  />
                  <YAxis
                    domain={[650, 800]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8E8E93", fontSize: 12 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-card rounded-lg p-2 border border-border">
                            <p className="text-sm font-semibold text-foreground">
                              Redox: {payload[0].value} mV
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="redox"
                    stroke="#00E5CC"
                    strokeWidth={3}
                    fill="url(#correlationGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )
      case "chemistry":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Spotreba chémie</h3>
              <span className="text-sm text-muted-foreground">2026</span>
            </div>
            <div className="space-y-4">
              {chemistryData.map((item) => (
                <div key={item.month} className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    {item.month}
                  </p>
                  <div className="space-y-1.5">
                    <ChemBar label="Soľ" value={item.salt} max={20} color="#00E5CC" unit="kg" />
                    <ChemBar
                      label="pH mínus"
                      value={item.phMinus}
                      max={10}
                      color="#5856D6"
                      unit="L"
                    />
                    <ChemBar
                      label="Algicíd"
                      value={item.algicide}
                      max={5}
                      color="#FF9500"
                      unit="L"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case "maintenance":
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Semafor údržby</h3>
            <div className="space-y-3">
              <MaintenanceItem
                label="Čistenie filtra"
                status="ok"
                lastDone="Pred 2 dňami"
              />
              <MaintenanceItem
                label="Prepieranie"
                status="warning"
                lastDone="Pred 5 dňami"
              />
              <MaintenanceItem
                label="Vysávanie"
                status="ok"
                lastDone="Dnes"
              />
              <MaintenanceItem
                label="Košík čerpadla"
                status="ok"
                lastDone="Pred 1 dňom"
              />
              <MaintenanceItem
                label="Kalibrácia sondy"
                status="danger"
                lastDone="Pred 30 dňami"
              />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Status Bar Spacer */}
      <div className="h-12" />

      {/* Header */}
      <header className="px-5 pb-4">
        <div className="flex items-center gap-4">
          {selectedChart ? (
            <button
              onClick={() => setSelectedChart(null)}
              className="w-10 h-10 rounded-full bg-card flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
          ) : null}
          <h1 className="text-2xl font-bold text-foreground">Analytika</h1>
        </div>
      </header>

      {/* Smart Alerts */}
      {!selectedChart && (
        <section className="px-5 pb-4 space-y-3">
          <WarningCard type="warning" title="Vysoký chlór — znížte dávkovanie" />
          <WarningCard
            type="prediction"
            title="pH prekročí optimum o 2 dni"
            description="Na základe aktuálneho trendu"
          />
        </section>
      )}

      {selectedChart ? (
        <section className="px-5">
          <div className="bg-card rounded-[20px] p-5">{renderChart()}</div>
        </section>
      ) : (
        <section className="px-5">
          <div className="bg-card rounded-[20px] overflow-hidden divide-y divide-border">
            {analyticsItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedChart(item.id)}
                className="w-full flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors text-left"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    item.iconBgColor
                  )}
                >
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-medium">{item.label}</p>
                  <p className="text-muted-foreground text-sm">
                    {item.subtitle}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
        </section>
      )}

      <BottomNav />
    </div>
  )
}

function ChemBar({
  label,
  value,
  max,
  color,
  unit,
}: {
  label: string
  value: number
  max: number
  color: string
  unit: string
}) {
  const percentage = (value / max) * 100

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-16">{label}</span>
      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-medium text-foreground w-12 text-right">
        {value} {unit}
      </span>
    </div>
  )
}

function MaintenanceItem({
  label,
  status,
  lastDone,
}: {
  label: string
  status: "ok" | "warning" | "danger"
  lastDone: string
}) {
  const statusColors = {
    ok: "bg-[#34C759]",
    warning: "bg-[#FF9500]",
    danger: "bg-[#FF3B30]",
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-[12px]">
      <div className={cn("w-3 h-3 rounded-full", statusColors[status])} />
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{lastDone}</p>
      </div>
      {status === "danger" && (
        <AlertTriangle className="w-4 h-4 text-[#FF3B30]" />
      )}
    </div>
  )
}
