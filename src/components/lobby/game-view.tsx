"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alphabet, PublicPlayer } from "@/types/multiplayer"
import { client } from "@/lib/client"
import { checkCharacter } from "@/lib/alphabets"

interface GameViewProps {
  character: string
  currentUser: PublicPlayer
  players: PublicPlayer[]
  target: number
  alphabet: Alphabet
}

export function GameView({
  character,
  currentUser,
  players,
  target,
  alphabet
}: GameViewProps) {
  const [input, setInput] = useState("")
  const [skipCooldown, setSkipCooldown] = useState(0)
  const [cooldownStart, setCooldownStart] = useState<number | null>(null)

  // Update skip cooldown timer
  useEffect(() => {
    if (!cooldownStart) return
    const updateCooldown = () => {
      const elapsed = Date.now() - cooldownStart
      const remaining = Math.max(0, 2000 - elapsed)
      setSkipCooldown(remaining)
      if (remaining === 0) {
        clearInterval(interval)
        setCooldownStart(null)
      }
    }
    updateCooldown()
    const interval = setInterval(updateCooldown, 100)
    return () => clearInterval(interval)
  }, [cooldownStart])

  const handleSkip = () => {
    if (skipCooldown <= 0) {
      client.skip.post()
      setCooldownStart(Date.now())
    }
  }

  // Handle input change and auto-submit
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)

    if (checkCharacter({ character, alphabet, input: value })) {
      client.checkinput.post({ input: value })
    }
  }

  // Clear input when character changes (scored)
  useEffect(() => {
    setInput("")
  }, [character])

  const allPlayers = [currentUser, ...players].sort((a, b) => b.score - a.score)
  const maxScore = Math.max(...allPlayers.map((p) => p.score))
  const progressPercentage = currentUser.score / target

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Main game area */}
          <div className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-800 p-8 animate-fade-in">
              <CardContent className="space-y-8 p-0">
                {/* Character display */}
                <div className="text-center">
                  <div className="text-[140px] md:text-[200px] font-bold text-white font-[var(--font-noto-sans-jp)] leading-none animate-zoom-in">
                    {character}
                  </div>
                </div>

                {/* Input field */}
                <div className="max-w-md mx-auto animate-slide-in-up space-y-4">
                  <Input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type here..."
                    className="text-2xl text-center h-16 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 transition-all duration-200 focus:scale-105"
                    inputMode="text"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    autoFocus={true}
                  />

                  {/* Skip button */}
                  <Button
                    onClick={handleSkip}
                    disabled={skipCooldown > 0}
                    variant="outline"
                    className="w-full bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {skipCooldown > 0
                      ? `Skip (available in ${(skipCooldown / 1000).toFixed(1)}s)`
                      : "Skip Character"}
                  </Button>
                </div>

                {/* Progress bar */}
                <div className="space-y-2 animate-slide-in-up" style={{ animationDelay: "100ms" }}>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Your Progress</span>
                    <span className="font-semibold text-slate-200">
                      {currentUser.score} / {target}
                    </span>
                  </div>
                  <progress
                    value={progressPercentage}
                    className="h-2 w-full transition-all duration-300"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard */}
          <div>
            <Card className="bg-slate-900/50 border-slate-800 animate-slide-in-right">
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-4 text-white">Leaderboard</h3>
                <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {allPlayers.map((player, index) => (
                    <div
                      key={player.username}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${player.username === currentUser.username
                        ? "bg-blue-950/50 border border-blue-800/50"
                        : "bg-slate-800/50 border border-slate-700/30"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg text-slate-500 w-6">#{index + 1}</span>
                        <span className="font-medium truncate text-slate-200">
                          {player.username}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-white">{player.score}</span>
                        {player.score === maxScore && player.score > 0 && (
                          <span className="text-xl animate-bounce-in">👑</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
