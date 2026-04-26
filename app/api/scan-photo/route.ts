import Anthropic from "@anthropic-ai/sdk"
import { NextRequest, NextResponse } from "next/server"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const TESTER_PROMPT = `Na fotke je komparátor (plastový testovacie zariadenie na meranie vody v bazéne).
Vyčítaj z farebných okienok hodnoty: pH, CL (voľný chlór), Alkalinita.
Vráť výsledok VÝLUČNE ako JSON objekt bez akéhokoľvek iného textu, napríklad:
{"pH": "7.2", "Cl": "1.5", "Alkalinita": "120"}
Ak niektorú hodnotu nevieš prečítať, vynechaj ju z JSON objektu.`

const ASECO_PROMPT = `Na fotke je displej senzora ASECO (automatický merací systém pre bazény).
Vyčítaj z displeja hodnoty: Redox (mV), pH, Salinita (g/l alebo %), Teplota (°C).
Vráť výsledok VÝLUČNE ako JSON objekt bez akéhokoľvek iného textu, napríklad:
{"Redox": "743", "pH": "7.38", "Salinita": "3.2", "Teplota": "29.3"}
Ak niektorú hodnotu nevieš prečítať, vynechaj ju z JSON objektu.`

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("image") as File | null
    const type = (formData.get("type") as string) ?? "tester"

    if (!file) {
      return NextResponse.json({ error: "Chýba obrázok" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")
    const mediaType = (file.type as "image/jpeg" | "image/png" | "image/webp" | "image/gif") || "image/jpeg"

    const prompt = type === "aseco" ? ASECO_PROMPT : TESTER_PROMPT

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64 },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
    })

    const raw =
      response.content[0]?.type === "text" ? response.content[0].text.trim() : "{}"

    // Extract JSON even if model adds surrounding text
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    const values = jsonMatch ? JSON.parse(jsonMatch[0]) : {}

    return NextResponse.json({ values })
  } catch (err) {
    console.error("scan-photo API error:", err)
    return NextResponse.json(
      { error: "Chyba pri analýze fotky" },
      { status: 500 }
    )
  }
}
