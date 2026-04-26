"use client"

import { useState, useRef } from "react"
import { Camera, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ScannedValues {
  pH?: string
  Cl?: string
  Alkalinita?: string
  Redox?: string
  Salinita?: string
  Teplota?: string
}

interface PhotoScannerProps {
  type: "tester" | "aseco"
  onValuesAccepted: (values: ScannedValues) => void
}

export function PhotoScanner({ type, onValuesAccepted }: PhotoScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedValues, setScannedValues] = useState<ScannedValues | null>(null)
  const [error, setError] = useState<string | null>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  const scanImage = async (file: File) => {
    setIsScanning(true)
    setScannedValues(null)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("image", file)
      formData.append("type", type)

      const res = await fetch("/api/scan-photo", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("scan failed")

      const data = await res.json()
      if (data.values && Object.keys(data.values).length > 0) {
        setScannedValues(data.values)
      } else {
        setError("Hodnoty sa nepodarilo prečítať. Skús znova.")
      }
    } catch {
      setError("Chyba pri analýze fotky. Skús znova.")
    } finally {
      setIsScanning(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) scanImage(file)
    e.target.value = ""
  }

  const handleAccept = () => {
    if (scannedValues) {
      onValuesAccepted(scannedValues)
      setScannedValues(null)
    }
  }

  const handleDiscard = () => {
    setScannedValues(null)
    setError(null)
  }

  return (
    <div className="space-y-3">
      {/* Hidden file inputs */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex gap-3">
        <button
          onClick={() => cameraRef.current?.click()}
          disabled={isScanning}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-secondary rounded-[12px] text-foreground font-medium text-sm active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          <Camera className="w-5 h-5" />
          Odfotit
        </button>
        <button
          onClick={() => galleryRef.current?.click()}
          disabled={isScanning}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-secondary rounded-[12px] text-foreground font-medium text-sm active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          <ImageIcon className="w-5 h-5" />
          Galéria
        </button>
      </div>

      {isScanning && (
        <div className="flex items-center justify-center gap-3 py-4 bg-secondary/50 rounded-[12px]">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <span className="text-sm text-muted-foreground">Analyzujem fotku...</span>
        </div>
      )}

      {error && !isScanning && (
        <div className="flex items-center gap-2 py-3 px-4 bg-destructive/10 rounded-[12px]">
          <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
          <span className="text-sm text-destructive">{error}</span>
        </div>
      )}

      {scannedValues && !isScanning && (
        <div className="bg-card rounded-[16px] p-4 border border-border">
          <div className="flex items-start gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-[#FF9500] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-[#FF9500] font-medium">
              AI odhad — skontroluj a uprav
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {Object.entries(scannedValues).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{key}</span>
                <span className="text-sm font-semibold text-foreground">
                  {value}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAccept}
              className="flex-1 py-2.5 bg-primary rounded-[12px] text-primary-foreground font-semibold text-sm active:scale-[0.98] transition-transform"
            >
              Pouzit hodnoty
            </button>
            <button
              onClick={handleDiscard}
              className="flex-1 py-2.5 bg-secondary rounded-[12px] text-foreground font-medium text-sm active:scale-[0.98] transition-transform"
            >
              Zahodit
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
