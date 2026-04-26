"use client"

import { cn } from "@/lib/utils"

interface ReadingCardProps {
  icon: React.ReactNode
  iconBgColor: string
  label: string
  value: string
  unit: string
  status?: "optimal" | "warning" | "danger"
  statusText?: string
}

export function ReadingCard({
  icon,
  iconBgColor,
  label,
  value,
  unit,
  status = "optimal",
  statusText,
}: ReadingCardProps) {
  const statusColors = {
    optimal: "bg-[#34C759]/15 text-[#34C759]",
    warning: "bg-[#FF9500]/15 text-[#FF9500]",
    danger: "bg-[#FF3B30]/15 text-[#FF3B30]",
  }

  return (
    <div className="bg-card rounded-[20px] p-4">
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            iconBgColor
          )}
        >
          {icon}
        </div>
        {statusText && (
          <span className={cn(
            "text-[10px] font-semibold px-2 py-0.5 rounded-full",
            statusColors[status]
          )}>
            {statusText}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-muted-foreground text-xs font-medium">{label}</p>
        <div className="flex items-baseline gap-0.5 mt-0.5">
          <span className="text-2xl font-bold text-card-foreground tracking-tight">
            {value}
          </span>
          {unit && <span className="text-muted-foreground text-sm">{unit}</span>}
        </div>
      </div>
    </div>
  )
}
