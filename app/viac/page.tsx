"use client"

import { useRouter } from "next/navigation"
import {
  ChevronRight,
  Calculator,
  Sparkles,
  BookOpen,
  Settings,
  Bell,
  HelpCircle,
  Share2,
  Star,
} from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    section: "NÁSTROJE",
    items: [
      {
        icon: Calculator,
        iconBgColor: "bg-[#FF9500]",
        label: "Kalkulačka chémie",
        subtitle: "Výpočet dávkovania",
        href: "#",
      },
      {
        icon: Sparkles,
        iconBgColor: "bg-[#5856D6]",
        label: "AI Asistent",
        subtitle: "Inteligentný pomocník",
        href: "/ai-asistent",
      },
      {
        icon: BookOpen,
        iconBgColor: "bg-[#FF3B30]",
        label: "Príručka",
        subtitle: "Návody a tipy",
        href: "#",
      },
    ],
  },
  {
    section: "NASTAVENIA",
    items: [
      {
        icon: Settings,
        iconBgColor: "bg-[#8E8E93]",
        label: "Nastavenia",
        subtitle: "Bazén, systémy, dáta",
        href: "/nastavenia",
      },
      {
        icon: Bell,
        iconBgColor: "bg-[#FF2D55]",
        label: "Notifikácie",
        subtitle: "Upozornenia a pripomienky",
        href: "#",
      },
    ],
  },
  {
    section: "PODPORA",
    items: [
      {
        icon: HelpCircle,
        iconBgColor: "bg-[#007AFF]",
        label: "Pomoc",
        subtitle: "FAQ a podpora",
        href: "#",
      },
      {
        icon: Share2,
        iconBgColor: "bg-[#34C759]",
        label: "Zdielat aplikáciu",
        subtitle: "Odporuč priatelom",
        href: "#",
      },
      {
        icon: Star,
        iconBgColor: "bg-[#FF9500]",
        label: "Ohodnotit",
        subtitle: "App Store",
        href: "#",
      },
    ],
  },
]

export default function MorePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Status Bar Spacer */}
      <div className="h-12" />

      {/* Header */}
      <header className="px-5 pb-4">
        <h1 className="text-2xl font-bold text-foreground">Viac</h1>
      </header>

      {/* Menu Sections */}
      <div className="px-5 space-y-4">
        {menuItems.map((section) => (
          <section key={section.section}>
            <p className="text-xs font-semibold text-muted-foreground tracking-wide mb-3 px-1">
              {section.section}
            </p>
            <div className="bg-card rounded-[20px] overflow-hidden divide-y divide-border">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => router.push(item.href)}
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
        ))}
      </div>

      {/* Version */}
      <div className="px-5 pt-8 text-center">
        <p className="text-sm text-muted-foreground">Elite Pool Care v1.0.0</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Made with care for pool owners
        </p>
      </div>

      <BottomNav />
    </div>
  )
}
