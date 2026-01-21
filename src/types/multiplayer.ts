import z from "zod"

export const targetSchema = z.number().min(10).default(50)
export type Target = z.infer<typeof targetSchema>

export const alphabetSchema = z.literal(["kanji", "katakana", "hiragana"]).default("kanji")
export type Alphabet = z.infer<typeof alphabetSchema>

export const gamemodeSchema = z.literal(["rush", "target-score"]).default("target-score")
export type GameMode = z.infer<typeof gamemodeSchema>

export const gamephaseSchema = z.literal(["lobby", "in-game"])
export type GamePhase = z.infer<typeof gamephaseSchema>

export const lobbyCapacitySchema = z.literal(10)
export type LobbyCapacity = z.infer<typeof lobbyCapacitySchema>
export const DEFAULT_CAPACITY = 10

export const lobbySchema = z.object({
  lobbyId: z.string(),
  owner: z.string(),
  startTime: z.number().optional(),
  target: targetSchema,
  alphabet: alphabetSchema,
  gamephase: gamephaseSchema,
  capacity: lobbyCapacitySchema,
})
export type Lobby = z.infer<typeof lobbySchema>

export const playerSchema = z.object({
  username: z.string(),
  sid: z.string(),
  lobbyId: z.string(),
  character: z.string(),
  isReady: z.boolean(),
  score: z.number().min(0).default(0),
})
export type Player = z.infer<typeof playerSchema>

export const publicPlayerSchema = z.object({
  username: z.string(),
  isReady: z.boolean(),
  score: z.number().min(0).default(0),
})
export type PublicPlayer = z.infer<typeof publicPlayerSchema>

export interface GameData {
  currentCharacter: string
  startTime?: number
  finishTime?: number
  usedTime?: number
}

export interface LobbyState {
  gameState: "LOBBY" | "COUNTDOWN" | "IN_GAME" | "RESULTS"
  loading: boolean
  players: PublicPlayer[]
  currentUser: PublicPlayer
  owner: string
  gameData: GameData
  target: number
  capacity: number
  alphabet: Alphabet
}
