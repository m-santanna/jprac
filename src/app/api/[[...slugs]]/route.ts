import { Elysia, t } from "elysia"
import { createPlayer, createLobby, joinLobby } from "@/lib/redis-setters"
import { z } from "zod"
import { alphabetSchema, targetSchema } from "@/types/multiplayer"
import { generateRandomId, generateRandomUsername } from "@/lib/utils"
import { getPlayerMetadata } from "@/lib/redis-getters"
import { encrypt } from "@/lib/session"
import { handleChangeLobbyConfig, handleCheckInput, handleGetLobbyState, handleKick, handleLeave, handleNotReady, handleReady, handleSkip } from "./game-handlers"
import { realtime } from "@/lib/realtime"

const COOKIE_MAX_AGE = 60 * 60 * 24 // 1 day
const UNAUTHORIZED_ERROR_MESSAGE = { message: "You aren't authed, or lobby doesn't exist anymore." }
const SESSION_COOKIE_SCHEMA = { cookie: t.Cookie({ session: t.Optional(t.String()) }) }

export const app = new Elysia({ prefix: "/api" })
  .post("/create",
    async ({ cookie: { session }, body: { alphabet, target }, status }) => {
      const player = await getPlayerMetadata({ session })
      if (player)
        return status("Not Acceptable", { message: "You already have a lobby." })

      const username = generateRandomUsername()
      const lobbyId = generateRandomId()
      const sid = generateRandomId()
      const token = await encrypt({ username, lobbyId, sid })

      await createPlayer({ sid, username, lobbyId })
      await createLobby({ lobbyId, alphabet, target, sid })
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
        target: targetSchema,
      }),
      ...SESSION_COOKIE_SCHEMA
    },
  )

  .get("lobby/:lobbyId/state",
    async ({ cookie: { session }, status, params: { lobbyId } }) => {
      const player = await getPlayerMetadata({ session })
      if (!player)
        return status("Not Acceptable", { message: "You don't belong to any lobby yet." })
      if (player.lobbyId !== lobbyId)
        return status("Not Acceptable", { message: "Not at the right lobby." })

      const state = await handleGetLobbyState(player)
      return status("OK", state)
    },
    SESSION_COOKIE_SCHEMA
  )

  .post("/join/:lobbyId",
    async ({ cookie: { session }, params: { lobbyId }, status }) => {
      let player = await getPlayerMetadata({ session })
      if (player)
        return status("Not Acceptable", { message: "You already have a lobby." })

      const sid = generateRandomId()
      const username = generateRandomUsername()
      const token = await encrypt({ username, lobbyId, sid })

      const res = await joinLobby({ sid, lobbyId })
      if (res === -2) return status("Unauthorized", { message: "The Lobby ID provided is not valid." })
      if (res === -1) return status("Unauthorized", { message: "Lobby is currently in-game. Try again later." })
      if (res === 0) return status("Unauthorized", { message: "The lobby is already full." })

      player = await createPlayer({ sid, username, lobbyId })
      session.set({
        value: token,
        httpOnly: true,
        maxAge: COOKIE_MAX_AGE,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })

      const channel = realtime.channel(lobbyId)
      await channel.emit("player.joined", { username })
      return status("OK", { lobbyId })
    },
    SESSION_COOKIE_SCHEMA
  )

  .post("lobby/:lobbyId/config",
    async ({ cookie: { session }, params: { lobbyId }, status, body: { alphabet, target } }) => {
      const playerMetadata = await getPlayerMetadata({ session })
      if (!playerMetadata)
        return status("Unauthorized", UNAUTHORIZED_ERROR_MESSAGE)

      await handleChangeLobbyConfig({ playerMetadata, alphabet, target, lobbyId })

    },
    {
      body: z.object({
        alphabet: alphabetSchema,
        target: targetSchema,
      }),
      ...SESSION_COOKIE_SCHEMA
    }
  )

  .post("ready",
    async ({ cookie: { session }, status }) => {
      const playerMetadata = await getPlayerMetadata({ session })
      if (!playerMetadata)
        return status("Unauthorized", UNAUTHORIZED_ERROR_MESSAGE)

      await handleReady(playerMetadata)
    },
    SESSION_COOKIE_SCHEMA
  )

  .post("notready",
    async ({ cookie: { session }, status }) => {
      const playerMetadata = await getPlayerMetadata({ session })
      if (!playerMetadata)
        return status("Unauthorized", UNAUTHORIZED_ERROR_MESSAGE)

      await handleNotReady(playerMetadata)
    },
    SESSION_COOKIE_SCHEMA
  )

  .post("kick",
    async ({ cookie: { session }, status, body: { username, lobbyId } }) => {
      const playerMetadata = await getPlayerMetadata({ session })
      if (!playerMetadata)
        return status("Unauthorized", UNAUTHORIZED_ERROR_MESSAGE)

      await handleKick({ playerMetadata, username, lobbyId })
    },
    {
      body: z.object({
        username: z.string(),
        lobbyId: z.string()
      }),
      ...SESSION_COOKIE_SCHEMA
    }
  )

  .post("checkinput",
    async ({ cookie: { session }, status, body: { input } }) => {
      const playerMetadata = await getPlayerMetadata({ session })
      if (!playerMetadata)
        return status("Unauthorized", UNAUTHORIZED_ERROR_MESSAGE)

      await handleCheckInput({ input, playerMetadata })
    },
    {
      body: z.object({
        input: z.string()
      }),
      ...SESSION_COOKIE_SCHEMA
    }
  )

  .post("skip", async ({ cookie: { session }, status }) => {
    const playerMetadata = await getPlayerMetadata({ session })
    if (!playerMetadata)
      return status("Unauthorized", UNAUTHORIZED_ERROR_MESSAGE)
    await handleSkip(playerMetadata)
  },
    SESSION_COOKIE_SCHEMA
  )

  .post("leave", async ({ cookie: { session }, status }) => {
    const playerMetadata = await getPlayerMetadata({ session })
    if (!playerMetadata)
      return status("Unauthorized", UNAUTHORIZED_ERROR_MESSAGE)
    await handleLeave(playerMetadata)
  },
    SESSION_COOKIE_SCHEMA
  )


export const GET = app.fetch
export const POST = app.fetch

export type App = typeof app

