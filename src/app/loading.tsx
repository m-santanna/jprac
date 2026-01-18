import { Loader2 } from "lucide-react"

export default function LoadingView() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
        <p className="text-lg text-slate-400">Loading...</p>
      </div>
    </div>
  )
}
