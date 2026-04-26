import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "ok" | "warning" | "danger" | "live"
  text?: string
  className?: string
}

export function StatusBadge({ status, text, className }: StatusBadgeProps) {
  const variants = {
    ok: "bg-[#34C759]/15 text-[#34C759]",
    warning: "bg-[#FF9500]/15 text-[#FF9500]",
    danger: "bg-[#FF3B30]/15 text-[#FF3B30]",
    live: "bg-[#00E5CC]/15 text-[#00E5CC]",
  }

  const defaultText = {
    ok: "V norme",
    warning: "Odchýlka",
    danger: "Kritické",
    live: "Live",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
        variants[status],
        className
      )}
    >
      {status === "live" && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      )}
      {text || defaultText[status]}
    </span>
  )
}
