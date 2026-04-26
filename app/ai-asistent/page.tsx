"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  Send,
  Droplets,
  Thermometer,
  Zap,
  FlaskConical,
} from "lucide-react"
import { cn } from "@/lib/utils"

const currentValues = {
  pH: "7.4",
  Cl: "2.0 ppm",
  Temp: "29.3°C",
  Redox: "743 mV",
}

const initialMessages = [
  {
    id: 1,
    role: "assistant" as const,
    content:
      "Ahoj! Som tvoj AI asistent pre starostlivosť o bazén. Môžem ti pomôcť s otázkami o kvalite vody, údržbe, alebo dávkovaní chémie. Čo by si chcel vedieť?",
  },
]

export default function AIAssistantPage() {
  const router = useRouter()
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = {
      id: messages.length + 1,
      role: "user" as const,
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Na základe aktuálnych hodnôt pH 7.4 a chlóru 2.0 ppm, tvoj bazén je v dobrom stave. Odporúčam však mierne znížiť dávkovanie chlóru, keďže hodnota je na hornej hranici optimálneho rozmedzia.",
        "Teplota vody 29.3°C je ideálna pre pohodlné plávanie. Pri tejto teplote sa môže chlór rýchlejšie vyparovať, preto sleduj jeho hladinu častejšie.",
        "Redox hodnota 743 mV indikuje dobrú dezinfekčnú schopnosť vody. Ak by klesla pod 650 mV, odporúčam zvýšiť dávku chlóru.",
        "Pre optimálnu kvalitu vody odporúčam kontrolovať pH a chlór aspoň 2-3x týždenne, zvlášť počas horúcich dní keď sa bazén používa častejšie.",
      ]

      const aiMessage = {
        id: messages.length + 2,
        role: "assistant" as const,
        content: responses[Math.floor(Math.random() * responses.length)],
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Status Bar Spacer */}
      <div className="h-12" />

      {/* Header */}
      <header className="px-5 pb-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">AI Asistent</h1>
        </div>
      </header>

      {/* Context Card */}
      <section className="px-5 pb-4 flex-shrink-0">
        <div className="bg-card rounded-[20px] p-4">
          <p className="text-xs font-semibold text-muted-foreground tracking-wide mb-3">
            AKTUÁLNE HODNOTY
          </p>
          <div className="grid grid-cols-4 gap-2">
            <ContextItem
              icon={<FlaskConical className="w-4 h-4" />}
              iconBgColor="bg-[#5856D6]"
              label="pH"
              value={currentValues.pH}
            />
            <ContextItem
              icon={<Droplets className="w-4 h-4" />}
              iconBgColor="bg-[#00E5CC]"
              label="Cl"
              value={currentValues.Cl}
            />
            <ContextItem
              icon={<Thermometer className="w-4 h-4" />}
              iconBgColor="bg-[#FF9500]"
              label="Temp"
              value={currentValues.Temp}
            />
            <ContextItem
              icon={<Zap className="w-4 h-4" />}
              iconBgColor="bg-[#FF2D55]"
              label="Redox"
              value={currentValues.Redox}
            />
          </div>
        </div>
      </section>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "max-w-[85%]",
              message.role === "user" ? "ml-auto" : "mr-auto"
            )}
          >
            <div
              className={cn(
                "rounded-[20px] p-4",
                message.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-[4px]"
                  : "bg-card text-card-foreground rounded-bl-[4px]"
              )}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="max-w-[85%] mr-auto">
            <div className="bg-card rounded-[20px] rounded-bl-[4px] p-4">
              <div className="flex gap-1.5">
                <span
                  className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-5 pb-8 pt-4 bg-background">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Napíš správu..."
            className="flex-1 h-12 px-5 bg-card rounded-full text-foreground placeholder:text-muted-foreground text-sm outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
              input.trim()
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground"
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function ContextItem({
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
    <div className="text-center">
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1.5 text-white",
          iconBgColor
        )}
      >
        {icon}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xs font-semibold text-foreground">{value}</p>
    </div>
  )
}
