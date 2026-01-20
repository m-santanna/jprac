import { checkCharacter, selectRandomCharacter } from "@/lib/alphabets";
import { realtime } from "@/lib/realtime";
import { arePlayersReady, getLobbyMetadata, getPublicPlayers, getUsername } from "@/lib/redis-getters";
import { kickPlayer, leaveLobby, lobbyStartUp, scoreAndSetupCharacter, setAllPlayersNotReady, setLobbyConfig, setLobbyPhaseToLobby, setPlayerNotReady, setPlayerReady, setupAllPlayersCharacters, updatePlayerCharacter } from "@/lib/redis-setters";
import { Alphabet, Player, PublicPlayer, Target } from "@/types/multiplayer";

export async function handleGetLobbyState(playerMetadata: Player) {
  const lobbyId = playerMetadata.lobbyId
  const username = playerMetadata.username
  const isReady = playerMetadata.isReady
  const sid = playerMetadata.sid
  const score = playerMetadata.score
  const lobbyMetadata = await getLobbyMetadata({ lobbyId })
  const target = lobbyMetadata.target
  const user = { username, isReady, score }

  const playersData: PublicPlayer[] = await getPublicPlayers({ lobbyMetadata, sid })
  const ownerUsername = await getUsername({ sid: lobbyMetadata.owner })

  const state = {
    user,
    others: playersData,
    target,
    capacity: lobbyMetadata.capacity,
    alphabet: lobbyMetadata.alphabet,
    owner: ownerUsername,
  }

  return state
}

export async function handleGameStart({ lobbyId }: { lobbyId: string }) {
  const lobbyMetadata = await getLobbyMetadata({ lobbyId })
  const NOW = Date.now()
  const BUFFER_MS = 3000
  const startTime = NOW + BUFFER_MS
  await lobbyStartUp({ lobbyMetadata, startTime })
  const character = await setupAllPlayersCharacters({ lobbyMetadata })

  const channel = realtime.channel(lobbyId)
  channel.emit("lobby.started", { character, startTime })
}

export async function handleChangeLobbyConfig({ playerMetadata, target, alphabet, lobbyId }: {
  playerMetadata: Player,
  target: Target,
  alphabet: Alphabet,
  lobbyId: string
}) {
  const lobbyMetadata = await getLobbyMetadata({ lobbyId })
  const sid = playerMetadata.sid
  if (lobbyMetadata.owner === sid && lobbyMetadata.gamephase === "lobby") {
    await setLobbyConfig({ alphabet, target, lobbyMetadata })

    const channel = realtime.channel(lobbyId)
    channel.emit("lobby.changed.config", { target, alphabet })
  }
}

export async function handleReady(playerMetadata: Player) {
  const lobbyId = playerMetadata.lobbyId
  const username = playerMetadata.username

  await setPlayerReady({ playerMetadata })

  const channel = realtime.channel(lobbyId)
  channel.emit("player.ready", { username })

  const everyoneReady = await arePlayersReady({ lobbyId })
  if (everyoneReady) handleGameStart({ lobbyId })
}

export async function handleNotReady(playerMetadata: Player) {
  const lobbyId = playerMetadata.lobbyId
  const username = playerMetadata.username

  await setPlayerNotReady({ playerMetadata })

  const channel = realtime.channel(lobbyId)
  channel.emit("player.notready", { username })
}

export async function handleLeave(playerMetadata: Player) {
  const lobbyId = playerMetadata.lobbyId
  const lobbyMetadata = await getLobbyMetadata({ lobbyId })
  const username = playerMetadata.username
  const sid = playerMetadata.sid
  const before = lobbyMetadata.owner
  const after = await leaveLobby({ lobbyId, sid })

  const channel = realtime.channel(lobbyId)
  channel.emit("player.left", { username })

  if (after && before !== after) {
    const afterUsername = await getUsername({ sid: after })
    channel.emit("lobby.changed.owner", { username: afterUsername })
  }
}

export async function handleKick({ username, lobbyId, playerMetadata }: { username: string, lobbyId: string, playerMetadata: Player }) {
  const lobbyMetadata = await getLobbyMetadata({ lobbyId })
  if (playerMetadata.sid === lobbyMetadata.owner) {
    const success = await kickPlayer({ username, lobbyMetadata })
    if (success) {
      const channel = realtime.channel(lobbyId)
      channel.emit("player.kicked", { username })
    }
  }
}

export async function handleSkip(playerMetadata: Player) {
  const lobbyId = playerMetadata.lobbyId
  const lobbyMetadata = await getLobbyMetadata({ lobbyId })

  if (lobbyMetadata.gamephase === "in-game" && playerMetadata.character) {
    const username = playerMetadata.username
    const alphabet = lobbyMetadata.alphabet
    const currentCharacter = playerMetadata.character
    const newCharacter = selectRandomCharacter(alphabet, currentCharacter)

    await updatePlayerCharacter({ playerMetadata, character: newCharacter })

    const channel = realtime.channel(lobbyId)
    channel.emit("player.skipped", { username, character: newCharacter })
  }
}

export async function handleCheckInput({ input, playerMetadata }: { input: string, playerMetadata: Player }) {
  const lobbyId = playerMetadata.lobbyId
  const lobbyMetadata = await getLobbyMetadata({ lobbyId })

  if (lobbyMetadata.startTime && lobbyMetadata.gamephase === "in-game") {
    let character = playerMetadata.character
    const alphabet = lobbyMetadata.alphabet
    const success = checkCharacter({ character, alphabet, input })

    if (success) {
      const username = playerMetadata.username
      const lobbyId = playerMetadata.lobbyId
      const target = lobbyMetadata.target

      character = selectRandomCharacter(alphabet, character)
      const score = await scoreAndSetupCharacter({ playerMetadata, character })
      const channel = realtime.channel(lobbyId)

      if (score == target) {
        await setLobbyPhaseToLobby({ lobbyMetadata })
        await setAllPlayersNotReady({ lobbyMetadata })

        const usedTime = Date.now() - lobbyMetadata.startTime
        channel.emit("player.finished", { username, usedTime })
      }
      else
        channel.emit("player.scored", { username, character })

    }
  }
}

