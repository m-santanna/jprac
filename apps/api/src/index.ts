import { Elysia } from "elysia"
import { createPlayer, createLobby, joinLobby, } from "./lib/redis/setters"
import { cors } from "@elysiajs/cors"
import { z } from "zod"
import { alphabetSchema, gamemodeSchema, lobbyCapacitySchema, } from "@repo/types/multiplayer"
import { generateRandomId, generateRandomUsername } from "./lib/server/helpers"
import { SESSION_COOKIE_SCHEMA } from "./lib/server/schemas"
import { serverWS } from "./lib/server/ws"
import { serverJWT } from "./lib/server/jwt"
import { getPlayerMetadata } from "./lib/redis/getters"

export const app = new Elysia()
  .use(
    cors({
      //origin: /.*\.langprac\.vercel.app$/,
      origin: "http://localhost:3000",
      credentials: true,
    }),
  )
  .use(serverJWT)
  .use(serverWS)
  .post(
    "/create-lobby",
    async ({
      jwt,
      cookie: { session },
      body: { alphabet, capacity, gamemode },
      status,
    }) => {
      session.remove()

      const username = generateRandomUsername()
      const lobbyId = generateRandomId()
      const sid = generateRandomId()
      const token = await jwt.sign({ sid, username, lobbyId })

      await createPlayer({ sid, username, lobbyId })
      await createLobby({ lobbyId, alphabet, capacity, gamemode, sid })
      session.set({
        value: token,
        httpOnly: true,
        maxAge: 60 * 30, // 30 min
        secure: false,
        sameSite: "lax",
      })
      return status("OK", { lobbyId })
    },
    {
      body: z.object({
        alphabet: alphabetSchema,
        capacity: lobbyCapacitySchema,
        gamemode: gamemodeSchema,
      }),
      ...SESSION_COOKIE_SCHEMA,
    },
  )
  .post(
    "/join-lobby",
    async ({ jwt, cookie: { session }, body: { lobbyId }, status }) => {

      const playerMeta = await getPlayerMetadata({ session, jwt })
      if (playerMeta) {
        if (playerMeta.lobbyId === lobbyId)
          return status("OK", { lobbyId })
        else
          return status("Not Acceptable", { err: "Wrong lobby!" })
      }
      session.remove()

      if (lobbyId.startsWith("http"))
        lobbyId = lobbyId.split("/").filter(Boolean).pop()!

      const sid = generateRandomId()
      const username = generateRandomUsername()
      const token = await jwt.sign({ username, lobbyId, sid })

      const res = await joinLobby({ sid, lobbyId })
      if (res === -2) return status("Locked", { error: "The lobbyId provided is not valid." })
      if (res === -1) return status("Locked", { error: "Lobby is currently in-game. Try again later." })
      if (res === 0) return status("Locked", { error: "The lobby is already full." })

      await createPlayer({ sid, username, lobbyId })
      session.set({
        value: token,
        httpOnly: true,
        maxAge: 60 * 30, // 30 min
        secure: false,
        sameSite: "lax",
      })
      return status("OK", { lobbyId: lobbyId })
    },
    {
      body: z.object({
        lobbyId: z.string(),
      }),
      ...SESSION_COOKIE_SCHEMA,
    },
  )

  .listen({
    port: 8080,
    hostname: "localhost",
  })

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
