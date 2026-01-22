"use client"

import { CharacterCard } from "./character-card"
import { CharacterData } from "@/lib/alphabets"

type CharacterGridProps = {
  characters: [string, CharacterData][]
  isKanji: boolean
}

export function CharacterGrid({ characters, isKanji }: CharacterGridProps) {
  if (characters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <p className="text-lg">No characters found</p>
        <p className="text-sm text-slate-600">Try adjusting your search</p>
      </div>
    )
  }

  return (
    <div
      className={`grid gap-2 ${
        isKanji
          ? "grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10"
          : "grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12"
      }`}
      style={{
        // Improve scroll performance for large lists
        contentVisibility: "auto",
        containIntrinsicSize: "auto 500px",
      }}
    >
      {characters.map(([char, data], index) => (
        <CharacterCard
          key={char}
          character={char}
          data={data}
          isKanji={isKanji}
          index={index}
        />
      ))}
    </div>
  )
}
