"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users } from "lucide-react"
import { toast } from "sonner"
import z from "zod"

export function JoinLobbyForm() {
  const router = useRouter()
  const [lobbyId, setLobbyId] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!lobbyId.trim()) {
      toast.error("Please enter a lobby ID")
      return
    }
    const { success } = z.url().safeParse(lobbyId)
    if (success) router.push(lobbyId)
    else router.push(`/lobby/${lobbyId}`)
  }

  return (
    <Card className="bg-stone-900/50 border-slate-800 backdrop-blur animate-slide-in-right">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-emerald-400" />
          Join Lobby
        </CardTitle>
        <CardDescription>Enter a lobby ID to join an existing game</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5.5">
          <div className="space-y-3">
            <Label htmlFor="lobbyId">Lobby ID</Label>
            <Input
              id="lobbyId"
              placeholder="Enter lobby ID or paste link"
              value={lobbyId}
              onChange={(e) => setLobbyId(e.target.value)}
              className="bg-slate-800 border-slate-700"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            Join Lobby
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
