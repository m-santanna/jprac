"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Loader2, Sparkles, Settings } from "lucide-react"
import { toast } from "sonner"
import { Alphabet, LobbyCapacity, Target } from "@/types/multiplayer"
import { client } from "@/lib/client"

export function CreateLobbyForm() {
  const router = useRouter()
  const [alphabet, setAlphabet] = useState<Alphabet>("hiragana")
  const [capacity, setCapacity] = useState<LobbyCapacity>(10)
  const [target, setTarget] = useState<Target>(50)

  async function createLobby() {
    const { data, error } = await client["create-lobby"].post({ alphabet, capacity, target })
    if (error) {
      throw new Error("Failed to create lobby")
    }
    return data.lobbyId
  }

  const mutation = useMutation({
    mutationFn: createLobby,
    onSuccess: (lobbyId) => {
      router.push(`/lobby/${lobbyId}`)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate()
  }

  return (
    <Card className="bg-stone-900/50 border-slate-800 backdrop-blur animate-slide-in-left">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-400" />
          Create Lobby
        </CardTitle>
        <CardDescription>Start a new game with custom settings</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-300">Game Settings</p>
              <p className="text-xs text-slate-500">
                {alphabet.charAt(0).toUpperCase() + alphabet.slice(1)} • {capacity} players •
                Target: {target}
              </p>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button size="icon" className="hover:bg-foreground/60 bg-foreground/90 rounded-full">
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-slate-900 border-slate-800" align="end">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Advanced Settings</h4>
                    <p className="text-xs text-slate-500">Customize your game experience</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="alphabet" className="text-slate-300">
                        Alphabet
                      </Label>
                      <Select value={alphabet} onValueChange={(v) => setAlphabet(v as Alphabet)}>
                        <SelectTrigger
                          id="alphabet"
                          className="bg-slate-800 border-slate-700 w-full"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800">
                          <SelectItem value="hiragana">Hiragana</SelectItem>
                          <SelectItem value="katakana">Katakana</SelectItem>
                          <SelectItem value="kanji">Kanji</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="capacity" className="text-slate-300">
                        Max Players
                      </Label>
                      <Input
                        id="capacity"
                        type="number"
                        min={2}
                        max={10}
                        value={capacity}
                        onChange={(e) => setCapacity(Number(e.target.value) as LobbyCapacity)}
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="target" className="text-slate-300">
                        Target Score
                      </Label>
                      <Input
                        id="target"
                        type="number"
                        min={10}
                        value={target}
                        onChange={(e) => setTarget(Number(e.target.value) as Target)}
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Lobby"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
