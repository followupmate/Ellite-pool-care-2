import Anthropic from "@anthropic-ai/sdk"
import { NextRequest, NextResponse } from "next/server"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `Si expert na starostlivosť o bazény. Radíš majiteľom bazénov v slovenčine.
Máš prístup k aktuálnym hodnotám vody (pH, chlór, redox, teplota, salinita, alkalinita).
Odpovedaj stručne, prakticky a v slovenčine. Ak hodnoty nie sú v norme, navrhni konkrétne opatrenia.
Optimálne hodnoty: pH 7.0–7.6, voľný chlór 0.5–2.5 mg/l, redox 650–850 mV, alkalinita 80–160 mg/l, salinita 3–5 g/l.`

export async function POST(req: NextRequest) {
  try {
    const { messages, poolValues } = await req.json()

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Chýbajú správy" },
        { status: 400 }
      )
    }

    const systemWithContext = poolValues
      ? `${SYSTEM_PROMPT}\n\nAktuálne hodnoty bazéna:\n${JSON.stringify(poolValues, null, 2)}`
      : SYSTEM_PROMPT

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemWithContext,
      messages: messages.map(
        (m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })
      ),
    })

    const text =
      response.content[0]?.type === "text" ? response.content[0].text : ""

    return NextResponse.json({ content: text })
  } catch (err) {
    console.error("chat API error:", err)
    return NextResponse.json(
      { error: "Chyba pri komunikácii s AI" },
      { status: 500 }
    )
  }
}
