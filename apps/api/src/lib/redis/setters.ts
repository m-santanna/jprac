import { Alphabet, GameMode, Player, Lobby } from "@repo/types/multiplayer"
import { redis } from "./client"

const JOIN_LOBBY_SCRIPT = `
    -- KEYS[1] = lobby:lobbyId:players
    -- KEYS[2] = lobby:lobbyId:meta
    -- ARGV[1] = sid

    local metaRaw = redis.call("GET", KEYS[2])
    if not metaRaw then
      return -2
    end

    local meta = cjson.decode(metaRaw)

    if meta.gamephase == "in-game" then
      return -1
    end

    local max = meta.capacity

    local current = redis.call("SCARD", KEYS[1])
    if current >= max then
      return 0
    end

    redis.call("SADD", KEYS[1], ARGV[1])
    return 1
  `

const JOIN_LOBBY_HASH = new Bun.CryptoHasher("sha1").update(JOIN_LOBBY_SCRIPT).digest("hex")

/**
 * Creates a player in our redis cache.
 *
 * @param sid The player's sessionId to associate in the key
 * @param username The player's username
 * @param lobbyId The player's lobby
 */
export async function createPlayer({
  sid,
  username,
  lobbyId,
}: {
  sid: string
  username: string
  lobbyId: string
}): Promise<void> {
  const key = `player:${sid}:meta`
  const value: Player = {
    username: username,
    sid,
    lobbyId,
    score: 0,
    usedTime: 0,
    isReady: false,
    character: "",
    input: ""
  }
  await redis.set(key, JSON.stringify(value))
}

/**
 * Creates a lobby in our redis cache.
 *
 * @param lobbyId The lobbyId to use as the key
 * @param sid The player's sessionId to register as the owner of the lobby
 * @param capacity The capacity of the lobby, i.e., max players allowed
 * @param alphabet The alphabet to be used
 * @param gamemode The gamemode to be used
 */
export async function createLobby({
  lobbyId,
  sid,
  capacity,
  alphabet,
  gamemode,
}: {
  lobbyId: string
  sid: string
  capacity?: number
  alphabet?: Alphabet
  gamemode?: GameMode
}): Promise<void> {
  const key = `lobby:${lobbyId}:meta`
  const value: Lobby = {
    owner: sid,
    capacity: capacity ? capacity : 10,
    alphabet: alphabet ? alphabet : "kanji",
    gamemode: gamemode ? gamemode : "rush",
    gamephase: "lobby",
    usedTime: 0,
  }
  await redis.set(key, JSON.stringify(value))
  await redis.sadd(`lobby:${lobbyId}:players`, sid)
}

/**
 * Joins a player in a given lobby, if that is possible.
 *
 * @param lobbyId - The id of the lobby to delete.
 * @param sid - The sessionId of the player requesting to join.
 *
 * @returns -2 if lobbyId is invalid, -1 if lobby is in-game, 0 if the lobby is already full or 1 if successful
 */
export async function joinLobby({ sid, lobbyId }: { sid: string; lobbyId: string }) {
  const args = ["2", `lobby:${lobbyId}:players`, `lobby:${lobbyId}:meta`, sid]
  try {
    return await redis.send("EVALSHA", [JOIN_LOBBY_HASH, ...args])
  } catch (err: any) {
    if (err.message?.includes("NOSCRIPT")) {
      return await redis.send("EVAL", [JOIN_LOBBY_SCRIPT, ...args])
    }
    throw err
  }
}

/**
 * Leaves the lobby.
 * If the user leaving is the owner of the lobby, the lobby is
 * deleted and so are the players inside.
 *
 * @param lobbyId - The id of the lobby to delete.
 * @param sid - The sessionId of the player requesting to leave.
 */
export async function leaveLobby({ lobbyId, sid }: { lobbyId: string; sid: string }) {
  const lobbyMeta = await redis.get(`lobby:${lobbyId}:meta`)
  const parsedMeta: Lobby = JSON.parse(lobbyMeta!)
  if (parsedMeta.owner === sid) deleteLobbyAndPlayers({ lobbyId })
  else {
    await redis.srem(`lobby:${lobbyId}:players`, sid)
    await redis.del(`player:${sid}:meta`)
  }
}

/**
 * Deletes the lobby and its players.
 *
 * @param lobbyId - The id of the lobby to delete.
 */
export async function deleteLobbyAndPlayers({ lobbyId }: { lobbyId: string }) {
  await redis.del(`lobby:${lobbyId}:meta`)
  const numOfPlayers = await redis.scard(`lobby:${lobbyId}:players`)
  for (let i = 0; i < numOfPlayers; i++) {
    const currJWT = await redis.spop(`lobby:${lobbyId}:players`)
    await redis.del(`player:${currJWT}:meta`)
  }
  await redis.del(`lobby:${lobbyId}:players`)
}
