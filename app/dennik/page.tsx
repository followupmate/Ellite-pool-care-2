"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  Plus,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { StatusBadge } from "@/components/status-badge"
import { PhotoScanner } from "@/components/photo-scanner"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const mockEntries = [
  {
    id: 1,
    date: "24. apríl 2026",
    time: "14:30",
    status: "ok" as const,
    pH: "7.4",
    Cl: "1.8",
    temp: "28.5",
  },
  {
    id: 2,
    date: "23. apríl 2026",
    time: "10:15",
    status: "warning" as const,
    pH: "7.6",
    Cl: "2.3",
    temp: "29.1",
  },
  {
    id: 3,
    date: "22. apríl 2026",
    time: "16:00",
    status: "ok" as const,
    pH: "7.3",
    Cl: "2.0",
    temp: "28.8",
  },
]

function DiaryContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    datetime: true,
    maintenance: false,
    chemistry: false,
    tester: false,
    aseco: false,
    notes: false,
    photos: false,
  })

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    filterMech: false,
    filterBackwash: false,
    vacuum: false,
    pumpBasket: false,
    salt: "",
    phMinus: "",
    algicide: "",
    flocculant: "",
    pH: "",
    Cl: "",
    alkalinity: "",
    tempTester: "",
    salinity: "",
    algicideAseco: "",
    redox: "",
    phAseco: "",
    notes: "",
  })

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setShowForm(true)
    }
  }, [searchParams])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleTesterScan = (values: Record<string, string>) => {
    setFormData((prev) => ({
      ...prev,
      pH: values.pH || prev.pH,
      Cl: values.Cl || prev.Cl,
      alkalinity: values.Alkalinita || prev.alkalinity,
    }))
  }

  const handleAsecoScan = (values: Record<string, string>) => {
    setFormData((prev) => ({
      ...prev,
      redox: values.Redox || prev.redox,
      phAseco: values.pH || prev.phAseco,
      salinity: values.Salinita || prev.salinity,
      tempTester: values.Teplota || prev.tempTester,
    }))
  }

  const handleSave = () => {
    setShowForm(false)
    router.push("/dennik")
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Status Bar Spacer */}
      <div className="h-12" />

      {/* Header */}
      <header className="px-5 pb-4">
        <div className="flex items-center justify-between">
          {showForm ? (
            <>
              <button
                onClick={() => setShowForm(false)}
                className="w-10 h-10 rounded-full bg-card flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <h1 className="text-lg font-semibold text-foreground">
                Nové meranie
              </h1>
              <button
                onClick={handleSave}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center"
              >
                <Check className="w-5 h-5 text-primary-foreground" />
              </button>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-foreground">Denník</h1>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary rounded-full text-primary-foreground font-semibold text-sm"
              >
                <Plus className="w-4 h-4" />
                Pridat meranie
              </button>
            </>
          )}
        </div>
      </header>

      {showForm ? (
        <div className="px-5 space-y-3">
          {/* Date & Time */}
          <FormSection
            title="DÁTUM A ČAS"
            expanded={expandedSections.datetime}
            onToggle={() => toggleSection("datetime")}
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">
                  Dátum
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="bg-secondary border-0 rounded-[12px] h-11"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">
                  Čas
                </label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  className="bg-secondary border-0 rounded-[12px] h-11"
                />
              </div>
            </div>
          </FormSection>

          {/* Maintenance */}
          <FormSection
            title="ÚDRŽBA"
            expanded={expandedSections.maintenance}
            onToggle={() => toggleSection("maintenance")}
          >
            <div className="space-y-3">
              <CheckboxItem
                label="Filter mech. nečistoty"
                checked={formData.filterMech}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, filterMech: checked as boolean })
                }
              />
              <CheckboxItem
                label="Prepieranie filtra"
                checked={formData.filterBackwash}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    filterBackwash: checked as boolean,
                  })
                }
              />
              <CheckboxItem
                label="Vysávanie"
                checked={formData.vacuum}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, vacuum: checked as boolean })
                }
              />
              <CheckboxItem
                label="Košík čerpadla"
                checked={formData.pumpBasket}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, pumpBasket: checked as boolean })
                }
              />
            </div>
          </FormSection>

          {/* Chemistry */}
          <FormSection
            title="DOPLNENIE CHÉMIE"
            expanded={expandedSections.chemistry}
            onToggle={() => toggleSection("chemistry")}
          >
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Soľ"
                unit="kg"
                value={formData.salt}
                onChange={(v) => setFormData({ ...formData, salt: v })}
              />
              <InputField
                label="pH mínus"
                unit="L"
                value={formData.phMinus}
                onChange={(v) => setFormData({ ...formData, phMinus: v })}
              />
              <InputField
                label="Algicíd"
                unit="L"
                value={formData.algicide}
                onChange={(v) => setFormData({ ...formData, algicide: v })}
              />
              <InputField
                label="Vločkovač"
                unit="ks"
                value={formData.flocculant}
                onChange={(v) => setFormData({ ...formData, flocculant: v })}
              />
            </div>
          </FormSection>

          {/* Tester Measurements */}
          <FormSection
            title="MERANIA (TESTER)"
            expanded={expandedSections.tester}
            onToggle={() => toggleSection("tester")}
          >
            <div className="space-y-4">
              <PhotoScanner type="tester" onValuesAccepted={handleTesterScan} />

              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="pH"
                  value={formData.pH}
                  onChange={(v) => setFormData({ ...formData, pH: v })}
                />
                <InputField
                  label="CL"
                  unit="mg/l"
                  value={formData.Cl}
                  onChange={(v) => setFormData({ ...formData, Cl: v })}
                />
                <InputField
                  label="Alkalinita"
                  unit="mg/l"
                  value={formData.alkalinity}
                  onChange={(v) => setFormData({ ...formData, alkalinity: v })}
                />
                <InputField
                  label="Teplota"
                  unit="°C"
                  value={formData.tempTester}
                  onChange={(v) => setFormData({ ...formData, tempTester: v })}
                />
              </div>
            </div>
          </FormSection>

          {/* ASECO Measurements */}
          <FormSection
            title="ASECO (SONDA)"
            expanded={expandedSections.aseco}
            onToggle={() => toggleSection("aseco")}
          >
            <div className="space-y-4">
              <PhotoScanner type="aseco" onValuesAccepted={handleAsecoScan} />

              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="Salinita"
                  value={formData.salinity}
                  onChange={(v) => setFormData({ ...formData, salinity: v })}
                />
                <InputField
                  label="Algicíd"
                  value={formData.algicideAseco}
                  onChange={(v) =>
                    setFormData({ ...formData, algicideAseco: v })
                  }
                />
                <InputField
                  label="Redox"
                  unit="mV"
                  value={formData.redox}
                  onChange={(v) => setFormData({ ...formData, redox: v })}
                />
                <InputField
                  label="pH−"
                  value={formData.phAseco}
                  onChange={(v) => setFormData({ ...formData, phAseco: v })}
                />
              </div>
            </div>
          </FormSection>

          {/* Notes */}
          <FormSection
            title="POZNÁMKA"
            expanded={expandedSections.notes}
            onToggle={() => toggleSection("notes")}
          >
            <Textarea
              placeholder="Voliteľná poznámka..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="bg-secondary border-0 rounded-[12px] min-h-[100px] resize-none"
            />
          </FormSection>

          {/* Photos */}
          <FormSection
            title="FOTKY"
            expanded={expandedSections.photos}
            onToggle={() => toggleSection("photos")}
          >
            <div className="flex gap-3">
              <button className="w-20 h-20 rounded-[12px] bg-secondary border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                <Plus className="w-6 h-6 text-muted-foreground" />
              </button>
            </div>
          </FormSection>
        </div>
      ) : (
        <div className="px-5 space-y-3">
          {mockEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-card rounded-[20px] p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{entry.date}</p>
                  <p className="text-sm text-muted-foreground">{entry.time}</p>
                </div>
                <StatusBadge status={entry.status} />
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">pH</p>
                  <p className="font-semibold text-foreground">{entry.pH}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Cl</p>
                  <p className="font-semibold text-foreground">
                    {entry.Cl} ppm
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Teplota</p>
                  <p className="font-semibold text-foreground">
                    {entry.temp}°C
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  )
}

function FormSection({
  title,
  expanded,
  onToggle,
  children,
}: {
  title: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="bg-card rounded-[20px] overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4"
      >
        <span className="text-xs font-semibold text-muted-foreground tracking-wide">
          {title}
        </span>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
      {expanded && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}

function CheckboxItem({
  label,
  checked,
  onCheckedChange,
}: {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={cn(
          "w-5 h-5 rounded-[6px]",
          checked && "bg-primary border-primary"
        )}
      />
      <span className="text-foreground text-sm">{label}</span>
    </label>
  )
}

function InputField({
  label,
  unit,
  value,
  onChange,
}: {
  label: string
  unit?: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1.5 block">
        {label} {unit && <span className="text-muted-foreground/60">({unit})</span>}
      </label>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-secondary border-0 rounded-[12px] h-11"
        placeholder="—"
      />
    </div>
  )
}

export default function DiaryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DiaryContent />
    </Suspense>
  )
}
