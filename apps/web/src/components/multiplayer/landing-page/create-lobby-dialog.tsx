"use client"

import { Label } from "@repo/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@repo/ui/components/dialog"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { alphabetAtom, usernameAtom } from "@/lib/atoms"
import { useAtom } from "jotai"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Loader, Plus } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const alphabetArr = [
  { value: "kanji", label: "Kanji" },
  { value: "hiragana", label: "Hiragana" },
  { value: "katakana", label: "Katakana" },
  { value: "cyrillic", label: "Cyrillic" },
]

const gamemodeArr = [
  { value: "rush", label: "Rush" },
  { value: "target-score", label: "Target Score" },
]

export default function CreateLobbyDialog() {
  const [alphabet, setAlphabet] = useAtom(alphabetAtom)
  const [capacity, setCapacity] = useState(4)
  const [gamemode, setGamemode] = useState("rush")
  const router = useRouter()

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (capacity < 2 || capacity > 10)
        toast.error("Max Players should be a value between 2 and 10")
      else {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL! + "/create-lobby", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ alphabet, capacity, gamemode }),
        })
        if (!res.ok) {
          toast.error("Something went wrong. Try again.")
          return
        }
        const json = await res.json()
        router.push(`/multiplayer/${json.lobbyId}`)
        return json
      }
    },
  })

  function SelectAlphabet() {
    return (
      <Select value={alphabet} onValueChange={(value) => setAlphabet(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Alphabet" />
        </SelectTrigger>
        <SelectContent>
          {alphabetArr.map((curr, idx) => (
            <SelectItem key={idx} value={curr.value}>
              {curr.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }
  function SelectGamemode() {
    return (
      <Select value={gamemode} onValueChange={(value) => setGamemode(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Game Mode" />
        </SelectTrigger>
        <SelectContent>
          {gamemodeArr.map((curr, idx) => (
            <SelectItem key={idx} value={curr.value}>
              {curr.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create</Button>
      </DialogTrigger>
      <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <DialogContent className="max-w-[90vw] sm:max-w-106.25 space-y-2">
        <DialogHeader>
          <DialogTitle>Create Lobby</DialogTitle>
          <DialogDescription>
            You just need to setup the basic configuration and send the link to your friends
            afterwards.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div className="flex gap-4 items-center">
            <Label className="w-30">Alphabet</Label>
            <SelectAlphabet />
          </div>
          <div className="flex gap-4 items-center">
            <Label className="w-30">Max Players</Label>
            <Input
              type="number"
              min={2}
              max={10}
              value={capacity}
              onChange={(e) => setCapacity(e.target.valueAsNumber)}
            />
          </div>
          <div className="flex items-center gap-4">
            <Label className="w-30">Game Mode</Label>
            <SelectGamemode />
          </div>
        </div>
        <Button disabled={isPending} className="sm:text-md" onClick={() => mutate()}>
          {isPending
            ? <Loader className="size-4 animate-spin" />
            : <div className="flex items-center gap-2">
              <Plus className="size-4" /> Create
            </div>}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
