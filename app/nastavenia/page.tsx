"use client"

import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Waves,
  Settings2,
  Calendar,
  Droplets,
  Wind,
  Zap,
  FlaskConical,
  Download,
  Upload,
  Info,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Status Bar Spacer */}
      <div className="h-12" />

      {/* Header */}
      <header className="px-5 pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Nastavenia</h1>
        </div>
      </header>

      {/* Pool Info */}
      <section className="px-5 pb-4">
        <p className="text-xs font-semibold text-muted-foreground tracking-wide mb-3 px-1">
          INFORMÁCIE O BAZÉNE
        </p>
        <div className="bg-card rounded-[20px] overflow-hidden divide-y divide-border">
          <SettingRow
            icon={<Waves className="w-5 h-5 text-white" />}
            iconBgColor="bg-[#00E5CC]"
            label="Názov"
            value="Fun 74"
          />
          <SettingRow
            icon={<Settings2 className="w-5 h-5 text-white" />}
            iconBgColor="bg-[#8E8E93]"
            label="Model"
            value="Intex 28372"
          />
          <SettingRow
            icon={<Droplets className="w-5 h-5 text-white" />}
            iconBgColor="bg-[#007AFF]"
            label="Objem"
            value="35 m³"
          />
          <SettingRow
            icon={<Wind className="w-5 h-5 text-white" />}
            iconBgColor="bg-[#5856D6]"
            label="Filtrácia"
            value="Piesková"
          />
          <SettingRow
            icon={<Calendar className="w-5 h-5 text-white" />}
            iconBgColor="bg-[#34C759]"
            label="Sezóna od"
            value="1. máj"
          />
          <SettingRow
            icon={<Calendar className="w-5 h-5 text-white" />}
            iconBgColor="bg-[#FF9500]"
            label="Sezóna do"
            value="30. september"
          />
        </div>
      </section>

      {/* Systems */}
      <section className="px-5 pb-4">
        <p className="text-xs font-semibold text-muted-foreground tracking-wide mb-3 px-1">
          SYSTÉMY
        </p>
        <div className="bg-card rounded-[20px] overflow-hidden divide-y divide-border">
          <ToggleRow
            icon={<Zap className="w-5 h-5 text-white" />}
            iconBgColor="bg-[#FF9500]"
            label="Čerpadlo"
            defaultChecked={true}
          />
          <ToggleRow
            icon={<Wind className="w-5 h-5 text-white" />}
            iconBgColor="bg-[#00E5CC]"
            label="Protiprúd"
            defaultChecked={false}
          />
          <ToggleRow
            icon={<Droplets className="w-5 h-5 text-white" />}
            iconBgColor="bg-[#007AFF]"
            label="Trysky"
            defaultChecked={true}
          />
          <ToggleRow
            icon={<FlaskConical className="w-5 h-5 text-white" />}
            iconBgColor="bg-[#5856D6]"
            label="Dávkovač chémie"
            defaultChecked={true}
          />
        </div>
      </section>

      {/* Data */}
      <section className="px-5 pb-4">
        <p className="text-xs font-semibold text-muted-foreground tracking-wide mb-3 px-1">
          DÁTA
        </p>
        <div className="bg-card rounded-[20px] overflow-hidden divide-y divide-border">
          <ActionRow
            icon={<Download className="w-5 h-5 text-white" />}
            iconBgColor="bg-[#34C759]"
            label="Export JSON"
            subtitle="Záloha všetkých dát"
          />
          <ActionRow
            icon={<Upload className="w-5 h-5 text-white" />}
            iconBgColor="bg-[#007AFF]"
            label="Import JSON"
            subtitle="Obnovit zo zálohy"
          />
        </div>
      </section>

      {/* About */}
      <section className="px-5 pb-4">
        <p className="text-xs font-semibold text-muted-foreground tracking-wide mb-3 px-1">
          O APLIKÁCII
        </p>
        <div className="bg-card rounded-[20px] overflow-hidden divide-y divide-border">
          <ActionRow
            icon={<Info className="w-5 h-5 text-white" />}
            iconBgColor="bg-[#8E8E93]"
            label="Elite Pool Care"
            subtitle="Verzia 1.0.0"
          />
        </div>
      </section>
    </div>
  )
}

function SettingRow({
  icon,
  iconBgColor,
  label,
  value,
}: {
  icon: React.ReactNode
  iconBgColor: string
  label: string
  value: string
}) {
  return (
    <button className="w-full flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors text-left">
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
          iconBgColor
        )}
      >
        {icon}
      </div>
      <span className="flex-1 text-foreground font-medium">{label}</span>
      <span className="text-muted-foreground text-sm">{value}</span>
      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
    </button>
  )
}

function ToggleRow({
  icon,
  iconBgColor,
  label,
  defaultChecked,
}: {
  icon: React.ReactNode
  iconBgColor: string
  label: string
  defaultChecked: boolean
}) {
  return (
    <div className="flex items-center gap-4 p-4">
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
          iconBgColor
        )}
      >
        {icon}
      </div>
      <span className="flex-1 text-foreground font-medium">{label}</span>
      <Switch defaultChecked={defaultChecked} />
    </div>
  )
}

function ActionRow({
  icon,
  iconBgColor,
  label,
  subtitle,
}: {
  icon: React.ReactNode
  iconBgColor: string
  label: string
  subtitle: string
}) {
  return (
    <button className="w-full flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors text-left">
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
          iconBgColor
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-foreground font-medium">{label}</p>
        <p className="text-muted-foreground text-sm">{subtitle}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
    </button>
  )
}
