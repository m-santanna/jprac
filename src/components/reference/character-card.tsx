"use client"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CharacterData } from "@/lib/alphabets"

type CharacterCardProps = {
  character: string
  data: CharacterData
  isKanji: boolean
  index: number
}

export function CharacterCard({
  character,
  data,
  isKanji,
  index,
}: CharacterCardProps) {
  // Only animate the first 24 items to prevent scroll performance issues
  const shouldAnimate = index < 24

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "group relative flex flex-col items-center justify-center",
            "p-3 rounded-xl border transition-all duration-200",
            "bg-stone-900/50 border-slate-800",
            "hover:bg-stone-800/70 hover:border-slate-700 hover:scale-105 hover:cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-stone-950",
            shouldAnimate && "animate-fade-in"
          )}
          style={shouldAnimate ? { animationDelay: `${index * 20}ms` } : undefined}
        >
          <span
            className={cn(
              "font-medium text-white",
              isKanji ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"
            )}
          >
            {character}
          </span>
          <span className="text-xs text-slate-500 mt-1 truncate max-w-full">
            {isKanji ? data.meaning || data.romaji : data.romaji}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-4 bg-slate-800 border-slate-700"
        side="top"
        sideOffset={8}
      >
        <div className="flex flex-col items-center gap-3">
          <span
            className={cn(
              "font-medium text-white",
              isKanji ? "text-4xl" : "text-5xl"
            )}
          >
            {character}
          </span>

          <div className="w-full space-y-2">
            {/* Romaji */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Romaji</span>
              <span className="text-white font-medium">
                {data.romaji}
                {data.romajiVariant && (
                  <span className="text-slate-400 ml-1">
                    / {data.romajiVariant}
                  </span>
                )}
              </span>
            </div>

            {/* Meaning (kanji only) */}
            {isKanji && data.meaning && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Meaning</span>
                <span className="text-white font-medium">
                  {data.meaning}
                  {data.meaningVariant && (
                    <span className="text-slate-400 ml-1">
                      / {data.meaningVariant}
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Accepted answers hint */}
          <div className="w-full pt-2 border-t border-slate-800">
            <p className="text-xs text-slate-500 text-center">
              Accepted:{" "}
              <span className="text-slate-400">
                {[
                  data.romaji,
                  data.romajiVariant,
                  data.meaning,
                  data.meaningVariant,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
