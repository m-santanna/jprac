import { Elysia, t } from "elysia"
import { createPlayer, createLobby, joinLobby } from "@/lib/redis-setters"
import { z } from "zod"
import { alphabetSchema, lobbyCapacitySchema, targetSchema } from "@/types/multiplayer"
import { generateRandomId, generateRandomUsername } from "@/lib/utils"
import { getPlayerMetadata } from "@/lib/redis-getters"
import { encrypt } from "@/lib/session"

const SESSION_COOKIE_SCHEMA = t.Cookie({
  session: t.Optional(t.String())
})

const COOKIE_MAX_AGE = 60 * 60 * 24 // 1 day

export const app = new Elysia({ prefix: "/api" })
  .post(
    "/create-lobby",
    async ({ cookie: { session }, body: { alphabet, capacity, target }, status }) => {
      session.remove()

      const username = generateRandomUsername()
      const lobbyId = generateRandomId()
      const sid = generateRandomId()
      const token = await encrypt({ username, lobbyId, sid })

      await createPlayer({ sid, username, lobbyId })
      await createLobby({ lobbyId, alphabet, target, capacity, sid })
      session.set({
        value: token,
        httpOnly: true,
        maxAge: COOKIE_MAX_AGE,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      return status("OK", { lobbyId })
    },
    {
      body: z.object({
        alphabet: alphabetSchema,
        capacity: lobbyCapacitySchema,
        target: targetSchema,
      }),
      cookie: SESSION_COOKIE_SCHEMA,
    },
  )
  .post(
    "/join-lobby",
    async ({ cookie: { session }, body: { lobbyId }, status }) => {
      const playerMeta = await getPlayerMetadata({ session })
      console.log(playerMeta)
      if (playerMeta) {
        if (playerMeta.lobbyId === lobbyId) return status("OK", { lobbyId })
        else return status("Not Acceptable", { error: "Wrong lobby!" })
      }
      session.remove()

      const sid = generateRandomId()
      const username = generateRandomUsername()
      const token = await encrypt({ username, lobbyId, sid })

      const res = await joinLobby({ sid, lobbyId })
      if (res === -2) return status("Locked", { error: "The lobbyId provided is not valid." })
      if (res === -1)
        return status("Locked", { error: "Lobby is currently in-game. Try again later." })
      if (res === 0) return status("Locked", { error: "The lobby is already full." })

      await createPlayer({ sid, username, lobbyId })
      session.set({
        value: token,
        httpOnly: true,
        maxAge: COOKIE_MAX_AGE,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      return status("OK", { lobbyId })
    },
    {
      body: z.object({
        lobbyId: z.string()
      }),
      cookie: SESSION_COOKIE_SCHEMA,
    },
  )

export const GET = app.fetch
export const POST = app.fetch

export type App = typeof app

