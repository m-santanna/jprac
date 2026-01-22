"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type SearchInputProps = {
  value: string
  onChangeAction: (value: string) => void
  resultCount: number
  totalCount: number
}

export function SearchInput({
  value,
  onChangeAction,
  resultCount,
  totalCount,
}: SearchInputProps) {
  return (
    <div className="relative flex items-center gap-3">
      <div className="relative flex-1 max-w-md">
        {/* Search icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <Input
          type="text"
          placeholder="Search by character, romaji, or meaning..."
          value={value}
          onChange={(e) => onChangeAction(e.target.value)}
          className={cn(
            "pl-10 pr-10 bg-slate-800 border-slate-700",
            "placeholder:text-slate-500 text-white",
            "focus:ring-blue-500 focus:border-blue-500"
          )}
        />

        {/* Clear button */}
        {value && (
          <button
            onClick={() => onChangeAction("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Result count */}
      <span className="text-sm text-slate-500 whitespace-nowrap">
        {value ? (
          <>
            <span className="text-slate-300">{resultCount}</span> of {totalCount}
          </>
        ) : (
          <>{totalCount} characters</>
        )}
      </span>
    </div>
  )
}
