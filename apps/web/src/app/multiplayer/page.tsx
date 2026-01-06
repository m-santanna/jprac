import CreateLobbyDialog from "@/components/multiplayer/landing-page/create-lobby-dialog"
import JoinLobbyDialog from "@/components/multiplayer/landing-page/join-lobby-dialog"
import { Button } from "@repo/ui/components/button"
import Link from "next/link"

export default function MultiplayerPage() {
  if (process.env.NEXT_PUBLIC_MULTIPLAYER_STATE === "prod")
    return (
      <section className="h-[calc(100vh-80px)] md:h-screen w-screen p-4 md:p-8 animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center justify-center gap-6 sm:gap-4 h-full">
          <h1 className="text-5xl sm:text-7xl text-gradient">Multiplayer</h1>
          <p className="text-gradient text-lg sm:text-2xl text-center">
            Currently under development! Come back later!
          </p>
          <div className="flex justify-between items-center gap-2 sm:mt-2">
            <Link href="/singleplayer">
              <Button className="w-full h-full">Soloplay</Button>
            </Link>
          </div>
        </div>
      </section>
    )
  return (
    <section className="h-[calc(100vh-80px)] md:h-screen w-screen p-4 md:p-8 animate-in fade-in zoom-in duration-300">
      <div className="flex flex-col items-center justify-center gap-6 sm:gap-4 h-full">
        <h1 className="text-5xl sm:text-7xl text-gradient">Multiplayer</h1>
        <p className="text-gradient text-lg sm:text-2xl text-center">
          You can either create or join a lobby.
        </p>
        <div className="flex justify-between items-center gap-2 sm:mt-2">
          <CreateLobbyDialog />
          <JoinLobbyDialog />
        </div>
      </div>
    </section>
  )
}
