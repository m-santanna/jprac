import { Player } from "@repo/types/multiplayer";
import { ServerWebSocket } from "elysia/ws/bun";
import { redis } from "@/lib/redis/client";
import { arePlayersReady } from "../redis/getters";
import { events } from "@repo/types/events";

export async function handleReady({ ws, playerMetadata }: { ws: ServerWebSocket<{}>, playerMetadata: Player }) {
  const lobbyId = playerMetadata.lobbyId
  const sid = playerMetadata.sid
  const username = playerMetadata.username

  const updated: Player = { ...playerMetadata, isReady: true }
  await redis.set(`player:${sid}:meta`, JSON.stringify(updated))

  const userEvent = { event: events.YOU_ARE_READY }
  const othersEvent = { event: events.ANOTHER_PLAYER_READY, data: { username } }
  ws.send(JSON.stringify(userEvent))
  ws.publish(lobbyId, JSON.stringify(othersEvent))

  const everyoneReady = await arePlayersReady({ lobbyId: updated.lobbyId })
  if (everyoneReady)
    handleGameStart()
}

export async function handleNotReady({ ws, playerMetadata }: { ws: ServerWebSocket<{}>, playerMetadata: Player }) {
  const lobbyId = playerMetadata.lobbyId
  const sid = playerMetadata.sid
  const username = playerMetadata.username

  const updated: Player = { ...playerMetadata, isReady: true }
  await redis.set(`player:${sid}:meta`, JSON.stringify(updated))

  const userEvent = { event: events.YOU_ARE_NOT_READY }
  const othersEvent = { event: events.ANOTHER_PLAYER_NOT_READY, data: { username } }
  ws.send(JSON.stringify(userEvent))
  ws.publish(lobbyId, JSON.stringify(othersEvent))
}

export async function handleGameStart() {
  console.log("game supposed to start!")
}
