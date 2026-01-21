import { Alphabet, Player, Lobby, Target } from "@/types/multiplayer"
import { redis } from "@/lib/redis"
import { selectRandomCharacter } from "@/lib/alphabets"
import { getSidFromUsername } from "@/lib/redis-getters"
import crypto from "crypto"

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

const JOIN_LOBBY_HASH = crypto.createHash("sha1").update(JOIN_LOBBY_SCRIPT).digest("hex")

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
}): Promise<Player> {
  const key = `player:${sid}:meta`
  const value: Player = {
    username: username,
    sid,
    lobbyId,
    score: 0,
    isReady: false,
    character: "",
  }
  await redis.set(key, JSON.stringify(value))
  return value
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
  target,
  alphabet,
}: {
  lobbyId: string
  sid: string
  target?: number
  alphabet?: Alphabet
}): Promise<void> {
  const key = `lobby:${lobbyId}:meta`
  const value: Lobby = {
    lobbyId,
    owner: sid,
    target: target ? target : 50,
    capacity: 10,
    alphabet: alphabet ? alphabet : "kanji",
    gamephase: "lobby",
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
  const keys = [`lobby:${lobbyId}:players`, `lobby:${lobbyId}:meta`]
  const args = [sid]
  try {
    return (await redis.evalsha(JOIN_LOBBY_HASH, keys, args)) as number
  } catch (_) {
    return (await redis.eval(JOIN_LOBBY_SCRIPT, keys, args)) as number
  }
}

/**
 * Leaves the lobby. If the owner of the lobby is the one leaving, the lobby selects a new player to be the owner.
 *
 * @pre Assumes lobbyId is valid!
 * @param lobbyId - The id of the lobby to delete.
 * @param sid - The sessionId of the player requesting to leave.
 *
 * @returns The owner of the lobby, after leave operations. Or undefined if the player leaving is the last one in the lobby.
 */
export async function leaveLobby({
  lobbyId,
  sid,
}: {
  lobbyId: string
  sid: string
}): Promise<string | undefined> {
  const lobbyMeta = await redis.get(`lobby:${lobbyId}:meta`) as Lobby
  let owner = lobbyMeta.owner
  const numOfPlayers = await redis.scard(`lobby:${lobbyId}:players`)
  if (numOfPlayers == 1) {
    await deleteLobbyAndPlayers({ lobbyId })
    return undefined
  } else {
    if (lobbyMeta.owner === sid) owner = await changeOwner({ lobbyMetadata: lobbyMeta })

    await redis.srem(`lobby:${lobbyId}:players`, sid)
    await redis.del(`player:${sid}:meta`)
    return owner
  }
}

/**
 * Changes the owner of the given lobby, and the new owner is set to not ready, if the gamephase is "lobby". If the sid is provided, they become the new owner. The lobby assigns a new owner
 * randomly otherwise.
 *
 * @pre Assumes the lobby has at least 2 players.
 * @pre Also assumes the sid is valid and in the lobby
 * @param lobbyMetadata The lobby metadata
 * @param sid The optional sid, which would be the new owner
 *
 * @returns The newly assigned owner
 */
export async function changeOwner({
  lobbyMetadata,
  sid,
}: {
  lobbyMetadata: Lobby
  sid?: string
}): Promise<string> {
  const lobbyId = lobbyMetadata.lobbyId
  const owner = lobbyMetadata.owner
  const gamephase = lobbyMetadata.gamephase
  if (sid) {
    const lobbyUpdated = { ...lobbyMetadata, owner: sid }
    await redis.set(`lobby:${lobbyId}:meta`, JSON.stringify(lobbyUpdated))
    if (gamephase === "lobby")
      await setPlayerNotReady({ sid })
    return sid
  }

  const playersArr = await redis.smembers(`lobby:${lobbyId}:players`)
  const candidates = playersArr.filter((p) => p !== owner)

  const newOwner = candidates[Math.floor(Math.random() * candidates.length)]

  const updated = { ...lobbyMetadata, owner: newOwner }
  await redis.set(`lobby:${lobbyId}:meta`, JSON.stringify(updated))

  if (gamephase === "lobby")
    await setPlayerNotReady({ sid: newOwner })

  return newOwner!
}

/**
 * Updates the lobby config to the new alphabet and target.
 *
 * @param lobbyMetadata The lobby metadata
 * @param alphabet The alphabet to update
 * @param target The target to update
 */
export async function setLobbyConfig({ alphabet, target, lobbyMetadata }: { lobbyMetadata: Lobby, alphabet: Alphabet, target: Target }) {
  const lobbyId = lobbyMetadata.lobbyId
  const updated = { ...lobbyMetadata, target, alphabet }
  await redis.set(`lobby:${lobbyId}:meta`, JSON.stringify(updated))
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

/**
 * Sets the player state to ready.
 *
 * @param playerMetadata The player metadata
 */
export async function setPlayerReady({ playerMetadata }: { playerMetadata: Player }) {
  const sid = playerMetadata.sid
  const updated: Player = { ...playerMetadata, isReady: true }
  await redis.set(`player:${sid}:meta`, JSON.stringify(updated))
}

/**
 * Sets the player state to not ready. And sets their score to 0. Also allows sid as params.
 * If playerMetadata is given, sid is ignored.
 *
 * @pre If given, assumes the sid is valid
 * @param playerMetadata The player metadata
 * @param sid The sid of the player
 */
export async function setPlayerNotReady({ playerMetadata, sid }: { playerMetadata?: Player, sid?: string }) {
  if (playerMetadata) {
    const updated: Player = { ...playerMetadata, score: 0, isReady: false }
    await redis.set(`player:${playerMetadata.sid}:meta`, JSON.stringify(updated))
  }
  else {
    const player: Player = await redis.get(`player:${sid}:meta`) as Player
    const updated: Player = { ...player, score: 0, isReady: false }
    await redis.set(`player:${sid}:meta`, JSON.stringify(updated))
  }
}

/**
 * Sets all players in the given lobby to not ready.
 *
 * @param lobbyMetadata The lobby metadata
 */
export async function setAllPlayersNotReady({ lobbyMetadata }: { lobbyMetadata: Lobby }) {
  const lobbyId = lobbyMetadata.lobbyId
  const players = await redis.smembers(`lobby:${lobbyId}:players`)
  for (let i = 0; i < players.length; i++) {
    const currSid = players[i]
    const playerMetadata = await redis.get(`player:${currSid}:meta`) as Player
    await setPlayerNotReady({ playerMetadata })
  }
}

/**
 * Sets the lobby state to "in-game" and the startTime to the one provided
 *
 * @param lobbyMetadata The lobby metadata
 * @param startTime The Date time the lobby is supposed to start
 */
export async function lobbyStartUp({
  lobbyMetadata,
  startTime,
}: {
  lobbyMetadata: Lobby
  startTime: number
}) {
  const lobbyId = lobbyMetadata.lobbyId
  const updated: Lobby = { ...lobbyMetadata, gamephase: "in-game", startTime }
  await redis.set(`lobby:${lobbyId}:meta`, JSON.stringify(updated))
}

/**
 * Sets the lobby state to "lobby"
 *
 * @param lobbyMetadata The lobby metadata
 */
export async function setLobbyPhaseToLobby({ lobbyMetadata }: { lobbyMetadata: Lobby }) {
  const lobbyId = lobbyMetadata.lobbyId
  const updated: Lobby = { ...lobbyMetadata, gamephase: "lobby" }
  await redis.set(`lobby:${lobbyId}:meta`, JSON.stringify(updated))
}

/**
 * Increments the score of the user and updates their character.
 *
 * @param playerMetadata The player metadata
 * @param character The new character to update
 *
 * @returns The updated score of the player
 */
export async function scoreAndSetupCharacter({
  playerMetadata,
  character,
}: {
  playerMetadata: Player
  character: string
}) {
  const sid = playerMetadata.sid
  const score = playerMetadata.score + 1
  const updated = { ...playerMetadata, score, character }
  await redis.set(`player:${sid}:meta`, JSON.stringify(updated))
  return score
}

/**
 * Sets up the first character to be used in the given lobby.
 *
 * @param lobbyMetadata The lobby metadata
 *
 * @returns The first character of the game (which is the same for every player)
 */
export async function setupAllPlayersCharacters({
  lobbyMetadata,
}: {
  lobbyMetadata: Lobby
}): Promise<string> {
  const lobbyId = lobbyMetadata.lobbyId
  const alphabet = lobbyMetadata.alphabet
  const character = selectRandomCharacter(alphabet, "")
  const playersArr = await redis.smembers(`lobby:${lobbyId}:players`)
  for (let i = 0; i < playersArr.length; i++) {
    const sid = playersArr[i]
    const playerMetadata = await redis.get(`player:${sid}:meta`) as Player
    const updated = { ...playerMetadata, character }
    await redis.set(`player:${sid}:meta`, JSON.stringify(updated))
  }
  return character
}

/**
 * Kicks a player from a lobby.
 *
 * @param username The username of the player to kickPlayer
 * @param lobbyMetadata The lobby data to kick the user from
 *
 * @returns true if operation successful, false otherwise.
 */
export async function kickPlayer({
  username,
  lobbyMetadata,
}: {
  username: string
  lobbyMetadata: Lobby
}): Promise<boolean> {
  const lobbyId = lobbyMetadata.lobbyId
  const sid = await getSidFromUsername({ username, lobbyId })
  if (!sid) return false
  await redis.del(`player:${sid}:meta`)
  const res = await redis.srem(`lobby:${lobbyId}:players`, sid)
  return res === 1
}

/**
 * Updates the player's character. 
 *
 * @param playerMetadata The player metadata
 * @param character The new character to assign
 */
export async function updatePlayerCharacter({
  playerMetadata,
  character,
}: {
  playerMetadata: Player
  character: string
}) {
  const sid = playerMetadata.sid
  const updated: Player = { ...playerMetadata, character }
  await redis.set(`player:${sid}:meta`, JSON.stringify(updated))
}
