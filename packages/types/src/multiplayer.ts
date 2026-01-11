import z from "zod"

export const targetSchema = z.number().min(10).default(50)
export type Target = z.infer<typeof targetSchema>

export const alphabetSchema = z.literal(["kanji", "katakana", "hiragana", "cyrillic"]).default("kanji")
export type Alphabet = z.infer<typeof alphabetSchema>

export const gamemodeSchema = z.literal(["rush", "target-score"])
export type GameMode = z.infer<typeof gamemodeSchema>

export const gamephaseSchema = z.literal(["lobby", "in-game"])
export type GamePhase = z.infer<typeof gamephaseSchema>

export const lobbyCapacitySchema = z.coerce.number().min(2).max(10).default(10)
export type LobbyCapacity = z.infer<typeof lobbyCapacitySchema>

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
  score: z.number().min(0),
})
export type Player = z.infer<typeof playerSchema>

export const wsMessageSchema = z.object({
  event: z.string(),
  data: z.object({
    input: z.string().optional(),
  }).optional()
})
export type WS_Message = z.infer<typeof wsMessageSchema>
