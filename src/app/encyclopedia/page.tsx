"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { hiraganaMap, katakanaMap, kanjiMap } from "@/lib/alphabets"
import { Alphabet } from "@/types/multiplayer"
import { AlphabetTabs } from "@/components/reference/alphabet-tabs"
import { CharacterGrid } from "@/components/reference/character-grid"
import { SearchInput } from "@/components/reference/search-input"
import { CharacterData } from "@/lib/alphabets"
import { ArrowLeft } from "lucide-react"

const alphabetMaps: Record<Alphabet, Record<string, CharacterData>> = {
  hiragana: hiraganaMap,
  katakana: katakanaMap,
  kanji: kanjiMap,
}

export default function EncyclopediaPage() {
  const [activeTab, setActiveTab] = useState<Alphabet>("kanji")
  const [search, setSearch] = useState("")

  const counts = useMemo(
    () => ({
      hiragana: Object.keys(hiraganaMap).length,
      katakana: Object.keys(katakanaMap).length,
      kanji: Object.keys(kanjiMap).length,
    }),
    []
  )

  const currentMap = alphabetMaps[activeTab]
  const allEntries = useMemo(
    () => Object.entries(currentMap) as [string, CharacterData][],
    [currentMap]
  )

  const filteredEntries = useMemo(() => {
    if (!search.trim()) return allEntries

    const query = search.toLowerCase().trim()
    return allEntries.filter(([char, data]) => {
      return (
        char.includes(query) ||
        data.romaji.toLowerCase().includes(query) ||
        data.romajiVariant?.toLowerCase().includes(query) ||
        data.meaning?.toLowerCase().includes(query) ||
        data.meaningVariant?.toLowerCase().includes(query)
      )
    })
  }, [allEntries, search])

  // Reset search when switching tabs
  const handleTabChange = (tab: Alphabet) => {
    setActiveTab(tab)
    setSearch("")
  }

  return (
    <div className="min-h-screen bg-stone-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-stone-950/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="flex items-center gap-1 text-slate-400 group hover:text-white transition-colors"
            >
              <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </Link>

            <h1 className="text-xl md:text-2xl font-bold text-white">
              Encyclopedia
            </h1>

            {/* Spacer for centering */}
            <div className="w-20" />
          </div>

          {/* Tabs and Search */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <AlphabetTabs
              activeTab={activeTab}
              onTabAction={handleTabChange}
              counts={counts}
            />

            <div className="sm:ml-auto">
              <SearchInput
                value={search}
                onChangeAction={setSearch}
                resultCount={filteredEntries.length}
                totalCount={allEntries.length}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <CharacterGrid
          characters={filteredEntries}
          isKanji={activeTab === "kanji"}
        />
      </main>
    </div>
  )
}
