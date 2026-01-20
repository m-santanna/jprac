"use client"

import { useEffect, useState } from "react"

interface CountdownViewProps {
  startTime: number
}

export function CountdownView({ startTime }: CountdownViewProps) {
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.ceil((startTime - Date.now()) / 1000)
      if (remaining > 0) {
        setCountdown(remaining)
      } else {
        setCountdown(0)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [startTime])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {countdown > 0 ? (
          <div className="text-9xl font-bold text-blue-500 animate-bounce-in">{countdown}</div>
        ) : (
          <div className="text-9xl font-bold text-emerald-500 animate-zoom-in">GO!</div>
        )}
      </div>
    </div>
  )
}
