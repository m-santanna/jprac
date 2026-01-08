import Elysia from "elysia";
import { SESSION_COOKIE_SCHEMA } from "./schemas";
import { getLobbyMetadata, getPlayerMetadata, isPlayerTheLobbyOwner } from "@/lib/redis/getters";
import { deleteLobbyAndPlayers, leaveLobby } from "@/lib/redis/setters";
import { app } from "@/index";
import { serverJWT } from "@/lib/server/jwt";
import { Lobby, Player, wsMessageSchema } from "@repo/types/multiplayer";
import { events } from "@repo/types/events";
import { handleCheckInput, handleNotReady, handleReady } from "./ws-handlers";

export const serverWS = new Elysia()
  .use(serverJWT)
  .ws("/multiplayer/:lobbyId", {

    async open(ws) {
      const lobbyId = ws.data.params.lobbyId
      ws.subscribe(lobbyId)

      // for development
      const playerMeta = await getPlayerMetadata({ jwt: ws.data.jwt, session: ws.data.cookie.session })
      if (!playerMeta) {
        console.log("For some reason, the playerMeta was undefined. Closing connection.")
        ws.close(4001, "The playerMeta was undefined!!")
      }
      else
        console.log(`User ${playerMeta.username} connected to ${lobbyId} with this data: ${playerMeta}`)
      //
    },

    async message(ws, message) {
      const event = message.event
      const eventData = message.data
      const session = ws.data.cookie.session
      const jwt = ws.data.jwt
      const lobbyId = ws.data.params.lobbyId

      const playerMetadata = await getPlayerMetadata({ session, jwt }) as Player
      const lobbyMetadata = await getLobbyMetadata({ lobbyId }) as Lobby

      if (event === events.READY)
        await handleReady({ ws, playerMetadata, lobbyMetadata })
      else if (event === events.NOT_READY)
        await handleNotReady({ ws, playerMetadata })
      else if (event === events.CHECK_INPUT)
        await handleCheckInput({ ws, playerMetadata, eventData, lobbyMetadata })
    },

    async close(ws) {
      const session = ws.data.cookie.session
      const lobbyId = ws.data.params.lobbyId
      const jwt = ws.data.jwt
      const playerMetada = await getPlayerMetadata({ session, jwt })
      console.log("This user closed connection")
      console.log(playerMetada!.sid)
      if (playerMetada) {
        if (await isPlayerTheLobbyOwner({ sid: playerMetada.sid, lobbyId })) {
          deleteLobbyAndPlayers({ lobbyId })
          app.server?.publish(lobbyId, JSON.stringify({ event: "LOBBY_DESTROYED" }))
        }
        else {
          leaveLobby({ lobbyId, sid: playerMetada.sid })
          ws.send(JSON.stringify({ event: "LEAVE_LOBBY" }))
        }
      }
    },
    body: wsMessageSchema,
    ...SESSION_COOKIE_SCHEMA
  })

