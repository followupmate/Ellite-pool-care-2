"use client"

import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

interface MenuItemProps {
  icon: React.ReactNode
  iconBgColor: string
  label: string
  subtitle?: string
  showChevron?: boolean
  onClick?: () => void
}

export function MenuItem({
  icon,
  iconBgColor,
  label,
  subtitle,
  showChevron = true,
  onClick,
}: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 bg-card hover:bg-secondary/50 transition-colors text-left"
    >
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
          iconBgColor
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-card-foreground font-medium">{label}</p>
        {subtitle && (
          <p className="text-muted-foreground text-sm truncate">{subtitle}</p>
        )}
      </div>
      {showChevron && (
        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      )}
    </button>
  )
}
