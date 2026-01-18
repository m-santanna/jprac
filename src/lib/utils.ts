import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { customAlphabet } from "nanoid"
const nanoid = customAlphabet("0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM")
const nanoid_numbers = customAlphabet("0123456789", 1)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const NAMES = [
  "neymar",
  "dunga",
  "zico",
  "vinijr",
  "kaka",
  "rivaldo",
  "romario",
  "fenomeno",
  "pele",
  "cafu",
]
const ADJECTIVES = [
  "funny",
  "cool",
  "goated",
  "diff",
  "nasty",
  "cracked",
  "wasted",
  "swift",
  "brave",
  "nice",
]

export function generateRandomUsername() {
  const first = Number(nanoid_numbers())
  const second = Number(nanoid_numbers())
  const third = nanoid_numbers(3)
  return `${ADJECTIVES[first]}-${NAMES[second]}-${third}`
}

export function generateRandomId(size?: number): string {
  return size ? nanoid(size) : nanoid(8)
}
