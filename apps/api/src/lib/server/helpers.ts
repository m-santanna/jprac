import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM')
const nanoid_numbers = customAlphabet('0123456789', 1)

const NAMES = ["neymar", "dunga", "zico", "vinijr", "kaka", "rivaldo", "romario", "fenomeno", "pele", "cafu"]
const ADJECTIVES = ["funny", "cool", "goated", "diff", "nasty", "cracked", "wasted", "swift", "brave", "nice"]

export function generateRandomUsername() {
  const first = Number(nanoid_numbers())
  const second = Number(nanoid_numbers())
  const third = nanoid_numbers(3)
  return `${ADJECTIVES[first]}-${NAMES[second]}-${third}`
}

export function generateRandomId(size?: number): string {
  return size ? nanoid(size) : nanoid(8)
}

export function checkCharacter({ character, alphabetMap, input }: { character: string, input: string, alphabetMap: any }) {
  const meta = alphabetMap[character]
  if (input === meta.romaji || input === meta.romajiVariant || input === meta.meaning || input === meta.meaningVariant)
    return true
  return false
}

export function selectRandomCharacter(alphabetMap: any, character: string) {
  const keys = Object.keys(alphabetMap)
  const index = Math.floor(Math.random() * keys.length)
  const picked = keys[index]!

  // this checks makes sure we never return the same character the user just played
  if (character === picked) {
    return selectRandomCharacter(alphabetMap, character)
  }
  return picked
}
