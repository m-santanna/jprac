"use client"

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
import { useMutation } from "@tanstack/react-query"
import { ClipboardPaste, Loader } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function JoinLobbyDialog() {
  const router = useRouter()

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const lobbyId = await navigator.clipboard.readText()
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL! + "/join-lobby", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lobbyId }),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error)
        return
      }
      router.push(`/multiplayer/${json.lobbyId}`)
      return json
    }
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Join</Button>
      </DialogTrigger>
      <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <DialogContent className="max-w-[90vw] sm:max-w-106.25 space-y-2">
        <DialogHeader>
          <DialogTitle>Join Lobby</DialogTitle>
          <DialogDescription>
            Copy the lobbyId or the url to your clipboard and press the button.
          </DialogDescription>
        </DialogHeader>
        <Button disabled={isPending} className="sm:text-md" onClick={() => mutate()}>
          {isPending
            ? <Loader className="size-4 animate-spin" />
            : <div className="flex items-center gap-2"><ClipboardPaste className="size-4" /> Join</div>
          }
        </Button>
      </DialogContent>
    </Dialog>
  )
}
