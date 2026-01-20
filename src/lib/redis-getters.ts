import { Lobby, Player, PublicPlayer } from "@/types/multiplayer"
import { redis } from "@/lib/redis"
import { Cookie } from "elysia"
import { decrypt } from "@/lib/session"

/**
 * Gets the metadata of the player from redis, if possible.
 *
 * @param session Elysia's cookie storing the JWT.
 *
 * @returns The player's metadata, or returns undefined if:
 *          1 - There is no value inside the session cookie.
 *          2 - The jwt verification failed
 *          3 - The user's metadata is not on redis anymore (the user left or was removed)
 */
export async function getPlayerMetadata({
  session,
}: {
  session: Cookie<string | undefined>
}): Promise<Player | undefined> {
  if (!session.value) return undefined
  const payload = await decrypt(session.value)
  if (!payload) return undefined
  const res: Player | null = await redis.get(`player:${payload.sid}:meta`)
  if (!res) return undefined
  return res
}

/**
 * Gets the metadata of the lobby from redis. 
 *
 * @pre Assumes the lobbyId is valid!!!
 * @param lobbyId The lobbyId of the lobby we are looking for.
 *
 * @returns The lobby metadata
 */
export async function getLobbyMetadata({ lobbyId }: { lobbyId: string }): Promise<Lobby> {
  const lobby = await redis.get(`lobby:${lobbyId}:meta`) as Lobby
  return lobby
}

export async function isPlayerTheLobbyOwner({ sid, lobbyId }: { sid: string; lobbyId: string }) {
  const lobby: Lobby | null = await redis.get(`lobby:${lobbyId}:meta`)
  if (!lobby) return false
  return lobby.owner === sid
}

/**
 * Checks if the given username already exists inside the given lobby
 *
 * @param username The username to check
 * @param lobbyId The lobbyId to check
 *
 * @returns true if check is successful, false otherwise
 */
export async function hasUsernameInLobby({
  username,
  lobbyId,
}: {
  username: string
  lobbyId: string
}): Promise<boolean> {
  const players: string[] = await redis.smembers(`lobby:${lobbyId}:players`)
  for (let i = 0; i < players.length; i++) {
    const playerJWT = players[i]
    const player = await redis.get(`player:${playerJWT}:meta`) as Player
    if (player.username === username) return true
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
  return await redis.sismember(`lobby:${lobbyId}:players`, sid) == 1
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
    const player = await redis.get(`player:${playersArr[i]}:meta`) as Player
    if (!player.isReady) return false
  }
  return true
}

export async function getCharacter({ playerMetadata }: { playerMetadata: Player }) {
  const sid = playerMetadata.sid
  const player = await redis.get(`player:${sid}:meta`) as Player
  return player.character
}

/**
 * Gets all the players (PublicPlayer format) in the given lobby except the player provided.
 *
 * @param lobbyMetadata The lobbyMetadata to get the players from
 * @param sid The sid of the player that is requesting the publicPlayers
 *
 * @returns A list with all the PublicPlayers in the lobby, except the player that requested it.
 */
export async function getPublicPlayers({
  lobbyMetadata,
  sid,
}: {
  lobbyMetadata: Lobby
  sid: string
}): Promise<PublicPlayer[]> {
  const lobbyId = lobbyMetadata.lobbyId
  const usefulData: PublicPlayer[] = []
  const playersArr = await redis.smembers(`lobby:${lobbyId}:players`)

  for (let i = 0; i < playersArr.length; i++) {
    const currSid = playersArr[i]
    if (currSid !== sid) {
      const currPlayer = await redis.get(`player:${currSid}:meta`) as Player
      const currData: PublicPlayer = {
        username: currPlayer.username,
        isReady: currPlayer.isReady,
        score: currPlayer.score,
      }
      usefulData.push(currData)
    }
  }
  return usefulData
}

/**
 * Gets the username from the given sid.
 *
 * @pre Assumes the sid is valid
 * @param sid The sid of the player
 *
 * @returns The username
 */
export async function getUsername({ sid }: { sid: string }) {
  const player = await redis.get(`player:${sid}:meta`) as Player
  return player.username
}

/**
 * Gets the sid from the provided username, if they are in the given lobby
 *
 * @param username The username of the player
 * @param lobbyId The lobbyId to check
 *
 * @returns The sid, if the username is found in the given lobby, undefined otherwise.
 */
export async function getSidFromUsername({
  username,
  lobbyId,
}: {
  username: string
  lobbyId: string
}) {
  const playersArr = await redis.smembers(`lobby:${lobbyId}:players`)
  for (let i = 0; i < playersArr.length; i++) {
    const curr = playersArr[i]
    const player = await redis.get(`player:${curr}:meta`) as Player
    if (player.username === username) return curr
  }
  return undefined
}
