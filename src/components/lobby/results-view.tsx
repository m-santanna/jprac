"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Clock, Loader2 } from "lucide-react"
import { LobbyState, PublicPlayer } from "@/types/multiplayer"
import { useLeaveLobbyMutation } from "@/hooks/leave-lobby-mutation"
import { Dispatch, SetStateAction } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ResultsViewProps {
  currentUser: PublicPlayer
  finalStandings: PublicPlayer[]
  usedTime: number
  setState: Dispatch<SetStateAction<LobbyState>>
}

export function ResultsView({
  currentUser,
  finalStandings,
  usedTime,
  setState
}: ResultsViewProps) {
  const currentUserRank = finalStandings.findIndex((p) => p.username === currentUser.username) + 1
  const winner = finalStandings[0]!
  const router = useRouter()

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getRankMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇"
      case 2:
        return "🥈"
      case 3:
        return "🥉"
      default:
        return null
    }
  }

  const leaveMutation = useLeaveLobbyMutation({
    onSuccess: () => {
      toast.info("You left the lobby.")
      setState((prev) => ({
        ...prev,
        realtimeEnabled: false
      }))
      router.push('/')
    }
  })

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center mb-8 animate-zoom-in">
          <Trophy className="h-20 w-20 text-amber-400 mx-auto mb-4 animate-bounce-in" />
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Game Over!</h1>
          <p className="text-xl text-slate-300">
            {currentUserRank === 1 ? (
              <span className="text-emerald-400 font-semibold animate-pulse">You won! 🎉</span>
            ) : (
              <span className="text-slate-400">
                You placed{" "}
                <span className="text-white font-semibold">
                  {currentUserRank}
                  {currentUserRank === 2 ? "nd" : currentUserRank === 3 ? "rd" : "th"}
                </span>
              </span>
            )}
          </p>
        </div>

        {/* Winner card */}
        <Card className="mb-6 bg-linear-to-br from-amber-950/50 to-amber-900/30 border-amber-800/50 animate-slide-in-down">
          <CardContent className="p-6 text-center">
            <div className="text-5xl mb-2 animate-bounce-in">🏆</div>
            <p className="text-2xl font-bold text-white">{winner.username}</p>
            <div className="flex items-center justify-center gap-2 mt-2 text-slate-300">
              <Clock className="h-4 w-4" />
              <span className="text-lg font-semibold">{formatTime(usedTime)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Results table */}
        <Card className="mb-6 bg-slate-900/50 border-slate-800 animate-fade-in">
          <CardHeader>
            <CardTitle>Final Standings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {finalStandings.map((player, index) => (
                <div
                  key={player.username}
                  className={`flex items-center justify-between p-4 rounded-lg animate-slide-in-left transition-all duration-300 ${player.username === currentUser.username
                    ? "bg-blue-950/50 border border-blue-800/50"
                    : "bg-slate-800/50 border border-slate-700/30"
                    }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{getRankMedal(index + 1)}</span>
                    <div>
                      <p className="font-semibold text-lg text-slate-200">{player.username}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{player.score}</p>
                    <p className="text-xs text-slate-500">points</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex gap-4 animate-slide-in-up">
          <Button
            onClick={() => setState((prev) => ({ ...prev, gameState: "LOBBY" }))}
            className="flex-1 transition-all text-foreground duration-300 bg-emerald-600 hover:bg-emerald-700"
          >
            Play Again
          </Button>

          <Button
            onClick={() => leaveMutation.mutate()}
            disabled={leaveMutation.isPending}
            className="flex-1 bg-red-800 hover:bg-red-900 text-foreground transition-all duration-300"
          >
            {leaveMutation.isPending
              ? <Loader2 className="size-4 animate-spin" />
              : "Leave Lobby"}
          </Button>

        </div>
      </div>
    </div>
  )
}
