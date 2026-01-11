import { Elysia } from "elysia"
import { createPlayer, createLobby, joinLobby, } from "./lib/redis/setters"
import { cors } from "@elysiajs/cors"
import { z } from "zod"
import { alphabetSchema, lobbyCapacitySchema, targetSchema, } from "@repo/types/multiplayer"
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
      body: { alphabet, capacity, target },
      status,
    }) => {
      session.remove()

      const username = generateRandomUsername()
      const lobbyId = generateRandomId()
      const sid = generateRandomId()
      const token = await jwt.sign({ sid, username, lobbyId })

      await createPlayer({ sid, username, lobbyId })
      await createLobby({ lobbyId, alphabet, target, capacity, sid })
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
        target: targetSchema,
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

  .get('/ws-test', async ({ jwt }) => {
    const lobbyId = 'lobbytst'
    const sid1 = 'session1'
    const sid2 = 'session2'
    const sid3 = 'session3'
    const user1 = 'username1'
    const user2 = 'username2'
    const user3 = 'username3'
    const token1 = await jwt.sign({ sid: sid1, username: user1, lobbyId })
    const token2 = await jwt.sign({ sid: sid2, username: user2, lobbyId })
    const token3 = await jwt.sign({ sid: sid3, username: user3, lobbyId })
    createLobby({ lobbyId, sid: sid1, capacity: 3, alphabet: "hiragana" })
    createPlayer({ sid: sid1, username: user1, lobbyId })
    await joinLobby({ sid: sid2, lobbyId })
    createPlayer({ sid: sid2, username: user2, lobbyId })
    await joinLobby({ sid: sid3, lobbyId })
    createPlayer({ sid: sid3, username: user3, lobbyId })
    console.log("token1:")
    console.log(token1)
    console.log("token2:")
    console.log(token2)
    console.log("token3:")
    console.log(token3)
  },
    SESSION_COOKIE_SCHEMA,
  )

  .listen({
    port: 8080,
    hostname: "localhost",
  })

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
