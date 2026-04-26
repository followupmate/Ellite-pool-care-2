import { cn } from "@/lib/utils"
import { AlertTriangle, Sparkles } from "lucide-react"

interface WarningCardProps {
  type: "warning" | "prediction"
  title: string
  description?: string
  className?: string
}

export function WarningCard({ type, title, description, className }: WarningCardProps) {
  const isWarning = type === "warning"

  return (
    <div
      className={cn(
        "rounded-[16px] p-4 flex items-start gap-3",
        isWarning ? "bg-[#FF9500]/10" : "bg-[#5856D6]/10",
        className
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
          isWarning ? "bg-[#FF9500]" : "bg-[#5856D6]"
        )}
      >
        {isWarning ? (
          <AlertTriangle className="w-5 h-5 text-white" />
        ) : (
          <Sparkles className="w-5 h-5 text-white" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn(
          "font-semibold text-sm",
          isWarning ? "text-[#FF9500]" : "text-[#5856D6]"
        )}>
          {isWarning ? "Upozornenie" : "Predikcia"}
        </p>
        <p className="text-foreground text-sm mt-0.5">{title}</p>
        {description && (
          <p className="text-muted-foreground text-xs mt-1">{description}</p>
        )}
      </div>
    </div>
  )
}
