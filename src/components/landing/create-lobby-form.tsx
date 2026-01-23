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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Loader2, Sparkles, Settings } from "lucide-react"
import { toast } from "sonner"
import { Alphabet, Target } from "@/types/multiplayer"
import { client } from "@/lib/client"

export function CreateLobbyForm() {
  const router = useRouter()
  const [alphabet, setAlphabet] = useState<Alphabet>("kanji")
  const [target, setTarget] = useState<Target>(30)
  const [loading, setLoading] = useState(false)

  const { mutate } = useMutation({
    mutationFn: async () => {
      setLoading(true)
      const { data, error } = await client.create.post({ alphabet, target })
      if (error) {
        throw new Error("Failed to create lobby")
      }
      return data.lobbyId
    },
    onSuccess: (lobbyId) => {
      toast.success("Lobby created successfully!")
      router.push(`/lobby/${lobbyId}`)
      setLoading(false)
    },
    onError: (error: Error) => {
      setLoading(false)
      toast.error(error.message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate()
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
                {alphabet.charAt(0).toUpperCase() + alphabet.slice(1)} • Target: {target}
              </p>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <button className="hover:text-foreground/60 text-foreground/90 hover:cursor-pointer rounded-full">
                  <Settings className="size-5" />
                </button>
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

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="target" className="text-slate-300">
                          Target Score
                        </Label>
                        <span className="text-sm font-medium text-emerald-400">{target}</span>
                      </div>
                      <Slider
                        id="target"
                        min={10}
                        max={100}
                        step={5}
                        value={[target]}
                        onValueChange={([value]) => setTarget(value as Target)}
                        className="py-2"
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>10</span>
                        <span>100</span>
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-foreground"
            disabled={loading}
          >
            {loading ? (
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
