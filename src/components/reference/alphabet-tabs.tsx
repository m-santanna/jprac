"use client"

import { cn } from "@/lib/utils"
import { Alphabet } from "@/types/multiplayer"

type AlphabetTabsProps = {
  activeTab: Alphabet
  onTabAction: (tab: Alphabet) => void
  counts: {
    hiragana: number
    katakana: number
    kanji: number
  }
}

const tabs: { value: Alphabet; label: string; shortLabel: string }[] = [
  { value: "hiragana", label: "Hiragana", shortLabel: "Hira" },
  { value: "katakana", label: "Katakana", shortLabel: "Kata" },
  { value: "kanji", label: "Kanji", shortLabel: "Kanji" },
]

export function AlphabetTabs({
  activeTab,
  onTabAction,
  counts,
}: AlphabetTabsProps) {
  return (
    <div className="flex gap-1.5 sm:gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabAction(tab.value)}
          className={cn(
            "px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-200",
            "flex items-center gap-1.5 sm:gap-2",
            "text-sm sm:text-base",
            activeTab === tab.value
              ? "bg-blue-600 text-white"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white hover:cursor-pointer"
          )}
        >
          {/* Show short label on mobile, full label on larger screens */}
          <span className="sm:hidden">{tab.shortLabel}</span>
          <span className="hidden sm:inline">{tab.label}</span>
          <span
            className={cn(
              "text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded-full",
              activeTab === tab.value
                ? "bg-blue-500 text-blue-100"
                : "bg-slate-700 text-slate-400"
            )}
          >
            {counts[tab.value]}
          </span>
        </button>
      ))}
    </div>
  )
}
