"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Command, Search, X } from "lucide-react"
import { useRef } from "react"
import { useHotkeys } from 'react-hotkeys-hook'
import { isMobile, isMacOs } from "react-device-detect"

type SearchInputProps = {
  value: string
  onChangeAction: (value: string) => void
  resultCount: number
  totalCount: number
}

export function SearchInput({ value, onChangeAction, resultCount, totalCount }: SearchInputProps) {
  const ref = useRef<HTMLInputElement>(null)
  useHotkeys('mod+k', () => {
    ref.current?.focus()
  })

  return (
    <div className="relative flex items-center gap-3 hover:cursor-text" onClick={() => ref.current?.focus()}>
      <div className="relative flex-1 max-w-md items-center">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
        <Input
          ref={ref}
          type="text"
          placeholder="Search"
          value={value}
          onChange={(e) => onChangeAction(e.target.value)}
          className={cn(
            "pl-10 pr-10 bg-slate-800 border-slate-700",
            "placeholder:text-slate-500 text-white",
            "focus:ring-blue-500 focus:border-blue-500"
          )}
        />
        {/* Keyboard shortcut hint */}
        {!value && !isMobile && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <kbd className="px-1.5 py-0.5 flex items-center text-xs text-slate-500 bg-slate-900/50 rounded border border-slate-700/50">
              {isMacOs ? <><Command className="size-3" />K</> : "Ctrl+K"}
            </kbd>
          </div>
        )}
        {/* Clear button */}
        {value && (
          <button
            onClick={() => onChangeAction("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 hover:cursor-pointer transition-colors"
          >
            <X className="size-4" />
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
