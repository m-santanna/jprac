"use client"

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Copy, Crown, X, Trophy, Languages, Users, Loader2, } from "lucide-react"
import { cn } from "@/lib/utils"
import { PublicPlayer, Alphabet, DEFAULT_CAPACITY, LobbyState } from "@/types/multiplayer"
import { toast } from "sonner"
import { useReadyButtonMutation } from "@/hooks/ready-button-mutation"
import { useLeaveLobbyMutation } from "@/hooks/leave-lobby-mutation"
import { useKickPlayerMutation } from "@/hooks/kick-player-mutation"
import { useRouter } from "next/navigation"

interface LobbyViewProps {
  lobbyId: string
  players: PublicPlayer[]
  currentUser: PublicPlayer
  owner: string
  target: number
  alphabet: Alphabet
  setState: Dispatch<SetStateAction<LobbyState>>
}

export function LobbyView({
  lobbyId,
  players,
  currentUser,
  owner,
  target,
  alphabet,
  setState,
}: LobbyViewProps) {
  const allPlayers = [currentUser, ...players]
  const isOwner = currentUser.username === owner
  const [isCopied, setIsCopied] = useState(false)
  const router = useRouter()
  const copyTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
    }
  }, [])

  const handleCopyLink = () => {
    const url = `${window.location.origin}/lobby/${lobbyId}`
    navigator.clipboard.writeText(url)
    toast.success("Lobby link copied to clipboard!")

    // Clear existing timeout if any
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current)
    }

    setIsCopied(true)
    copyTimeoutRef.current = setTimeout(() => {
      toast.dismiss()
      setIsCopied(false)
    }, 3000)
  }

  const readyMutation = useReadyButtonMutation({
    isUserReady: currentUser.isReady,
    onSuccess: (isReady) => setState((prev) => ({
      ...prev,
      currentUser: { ...prev.currentUser, isReady, score: 0 }
    }))
  })
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
  const kickPlayerMutation = useKickPlayerMutation({
    onSuccess: (username) => {
      setState((prev) => ({
        ...prev,
        players: prev.players.filter((p) => p.username !== username)
      }))
      toast.info(`${username} was kicked from the lobby`)
    }
  })

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-3xl mx-auto py-8">
        <div className="text-center mb-8 animate-slide-in-down">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Hello, {currentUser.username} 👋
          </h1>
          <div className="flex items-center justify-center gap-2">
            <code className="text-lg bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-slate-200 font-mono">
              {lobbyId}
            </code>
            <Button
              size="icon"
              onClick={handleCopyLink}
              disabled={isCopied}
              className="h-8 w-8 bg-background text-foreground hover:text-foreground/70 rounded-full transition-all duration-300"
            >
              {isCopied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-sm text-slate-500 mt-2">Share this code with your friends</p>
        </div>

        {/* Lobby Metadata */}
        <div className="flex items-center justify-center gap-6 text-sm text-slate-400 pb-4">
          {/* Target Score */}
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span>{target}</span>
          </div>

          {/* Alphabet */}
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            <span className="capitalize">{alphabet}</span>
          </div>

          {/* Capacity */}
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>
              {allPlayers.length}/{DEFAULT_CAPACITY}
            </span>
          </div>
        </div>

        <Card className="mb-6 bg-slate-900/50 border-slate-800 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg">Players</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Players List */}
            <div className="space-y-2">
              {allPlayers.map((player, index) => (
                <div
                  key={player.username}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border animate-slide-in-left transition-all duration-300",
                    player.username === currentUser.username
                      ? "bg-blue-500/10 border-blue-500/30"
                      : "bg-slate-800/50 border-slate-700/50",
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${player.isReady ? "bg-emerald-500" : "bg-slate-600"
                        }`}
                    />
                    <span
                      className="font-medium text-slate-200"
                    >
                      {player.username}
                      {player.username === currentUser.username && (
                        <span className="ml-2 text-blue-400 font-semibold text-xs">(YOU)</span>
                      )}
                    </span>
                    {player.username === owner && (
                      <Crown className="h-4 w-4 text-amber-400 animate-bounce-in" />
                    )}
                  </div>

                  {isOwner && player.username !== currentUser.username && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => kickPlayerMutation.mutate({ lobbyId, username: player.username })}
                      disabled={kickPlayerMutation.isPending}
                      className="h-5 w-5 text-red-400 hover:text-red-300 hover:bg-red-950/30"
                    >
                      {
                        kickPlayerMutation.isPending
                          ? <Loader2 className="size-4 animate-spin" />
                          : <X className="h-4 w-4" />
                      }
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 animate-slide-in-up">
          <Button
            onClick={() => readyMutation.mutate()}
            className={`flex-1 transition-all duration-300 text-foreground ${currentUser.isReady
              ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
              : "bg-emerald-700 hover:bg-emerald-800"
              }`}
            disabled={readyMutation.isPending}
          >
            {readyMutation.isPending
              ? <Loader2 className="size-4 animate-spin" />
              : (
                currentUser.isReady
                  ? <><Check className="mr-2 h-4 w-4" /> Ready</>
                  : "Ready Up"
              )
            }
          </Button>
          <Button
            onClick={() => leaveMutation.mutate()}
            disabled={leaveMutation.isPending}
            className="flex-1 bg-red-800 hover:bg-red-900 text-foreground transition-all duration-300"
          >
            {leaveMutation.isPending
              ? <Loader2 className="size-4 animate-spin" />
              : "Leave Lobby"
            }
          </Button>
        </div>
      </div>
    </div>
  )
}
