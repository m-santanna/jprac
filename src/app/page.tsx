import { CreateLobbyForm } from "@/components/landing/create-lobby-form"
import { JoinLobbyForm } from "@/components/landing/join-lobby-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            jprac
          </h1>
          <p className="text-lg md:text-xl text-slate-400">
            Practice kana/kanji with friends in real-time
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <CreateLobbyForm />
          <JoinLobbyForm />
        </div>
      </div>
    </main>
  )
}
