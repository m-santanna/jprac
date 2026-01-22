import Link from "next/link"
import { CreateLobbyForm } from "@/components/landing/create-lobby-form"
import { JoinLobbyForm } from "@/components/landing/join-lobby-form"
import { BookOpen, ChevronRight } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header with reference link */}
        <div className="flex justify-end mb-6">
          <Link
            href="/encyclopedia"
            className="flex items-center text-base gap-2 text-slate-400 hover:text-white transition-colors group"
          >
            <BookOpen className="size-5" />
            <span>Encyclopedia</span>
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

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
