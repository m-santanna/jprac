import { Lobby, Player } from "@repo/types/multiplayer"
import { redis } from "./client"
import { ElysiaJWT } from "@/lib/server/jwt"
import { Cookie } from "elysia"

/**
 * Gets the metadata of the player from redis, if possible.
 *
 * @param session Elysia's cookie storing the JWT.
 * @param jwt Elysia's jwt object, that can be extracted from the request
 *
 * @returns The player's metadata, or returns undefined if: 
 *          1 - There is no value inside the session cookie.
 *          2 - The jwt verification failed
 *          3 - The user's metadata is not on redis anymore (the user left or was removed)
 */
export async function getPlayerMetadata({ session, jwt }: { session: Cookie<string | undefined>, jwt: ElysiaJWT }): Promise<Player | undefined> {
  if (!session.value)
    return undefined
  const payload = await jwt.verify(session.value)
  if (!payload)
    return undefined
  const raw = await redis.get(`player:${payload.sid}:meta`)
  if (!raw)
    return undefined
  return JSON.parse(raw)
}

/**
 * Gets the metadata of the lobby from redis. Assumes the lobbyId is valid!!!
 *
 * @param lobbyId The lobbyId of the lobby we are looking for.
 *
 * @returns The lobby metadata
 */
export async function getLobbyMetadata({ lobbyId }: { lobbyId: string }): Promise<Lobby> {
  const lobbyRaw = await redis.get(`lobby:${lobbyId}:meta`)
  return JSON.parse(lobbyRaw!)
}

export async function isPlayerTheLobbyOwner({ sid, lobbyId }: { sid: string, lobbyId: string }) {
  const lobbyRaw = await redis.get(`lobby:${lobbyId}:meta`)
  if (!lobbyRaw)
    return false
  const meta: Lobby = JSON.parse(lobbyRaw)
  return meta.owner === sid
}

/**
 * Checks if the given username already exists inside the given lobby
 *
 * @param username The username to check
 * @param lobbyId The lobbyId to check
 *
 * @returns true if check is successful, false otherwise
 */
export async function hasUsernameInLobby({ username, lobbyId }: { username: string, lobbyId: string }): Promise<boolean> {
  // remember that we are saving the playerJWT in the lobby:lobbyId:players set.
  const players: string[] = await redis.smembers(`lobby:${lobbyId}:players`)
  for (let i = 0; i < players.length; i++) {
    const playerJWT = players[i]
    const playerRaw = await redis.get(`player:${playerJWT}:meta`)
    const playerMeta: Player = JSON.parse(playerRaw!)
    if (playerMeta.username === username)
      return true
  }
  return false
}

/**
 * Checks if the given player is inside the given lobby
 *
 * @param sid The player's sessionId (sid) to check
 * @param lobbyId The lobbyId to check
 *
 * @returns true if check is successful, false otherwise
 */
export async function isPlayerInLobby({
  lobbyId,
  sid,
}: {
  lobbyId: string
  sid: string
}): Promise<boolean> {
  return await redis.sismember(`lobby:${lobbyId}:players`, sid)
}

/**
 * Checks if the given lobby is empty or not.
 *
 * @param lobbyId The lobbyId to check
 *
 * @returns true if check is successful, false otherwise
 */
export async function isLobbyEmpty({ lobbyId }: { lobbyId: string }): Promise<boolean> {
  const response = await redis.scard(`lobby:${lobbyId}:players`)
  return response === 0
}

/**
 *  Verifies if every player in a lobby is ready or not.
 *
 *  @param lobbyId The lobbyId to check
 *
 *  @returns true if check is successful, false otherwise
 */
export async function arePlayersReady({ lobbyId }: { lobbyId: string }): Promise<boolean> {
  const playersArr = await redis.smembers(`lobby:${lobbyId}:players`)
  for (let i = 0; i < playersArr.length; i++) {
    const raw = await redis.get(`player:${playersArr[i]}:meta`)
    const parsed: Player = JSON.parse(raw!)
    if (!parsed.isReady)
      return false
  }
  return true
}

export async function getCharacter({ playerMetadata }: { playerMetadata: Player }) {
  const sid = playerMetadata.sid
  const raw = await redis.get(`player:${sid}:meta`)
  const parsed: Player = JSON.parse(raw!)
  return parsed.character
}
