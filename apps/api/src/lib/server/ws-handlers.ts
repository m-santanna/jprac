import { Lobby, Player, PublicPlayer } from "@repo/types/multiplayer";
import { ServerWebSocket } from "elysia/ws/bun";
import { arePlayersReady, getPublicPlayers, getUsername } from "../redis/getters";
import { events } from "@repo/types/events";
import { checkCharacter, selectRandomCharacter } from "@repo/alphabets/alphabets";
import { kickPlayer, leaveLobby, lobbyStartUp, scoreAndSetupCharacter, setAllPlayersNotReady, setLobbyPhaseToLobby, setPlayerNotReady, setPlayerReady, setupAllPlayersCharacters, } from "../redis/setters";
import { app } from "@/index";

export async function handleJoinLobby({ ws, playerMetadata, lobbyMetadata }: { ws: ServerWebSocket<{}>, playerMetadata: Player, lobbyMetadata: Lobby }) {
  const lobbyId = playerMetadata.lobbyId
  const username = playerMetadata.username
  const isReady = playerMetadata.isReady
  const score = playerMetadata.score
  const target = lobbyMetadata.target
  const user = { username, isReady, score, isOwner: false }

  const playersData: PublicPlayer[] = await getPublicPlayers({ lobbyMetadata, playerMetadata })

  const userEvent = { event: events.JOINED, data: { user, others: playersData, target } }
  const othersEvent = { event: events.ANOTHER_PLAYER_JOINED, data: user }
  ws.send(JSON.stringify(userEvent))
  ws.publish(lobbyId, JSON.stringify(othersEvent))
}

export async function handleReady({ ws, playerMetadata, lobbyMetadata }: {
  ws: ServerWebSocket<{}>,
  playerMetadata: Player,
  lobbyMetadata: Lobby
}) {
  const lobbyId = playerMetadata.lobbyId
  const username = playerMetadata.username

  await setPlayerReady({ playerMetadata })

  const userEvent = { event: events.YOU_ARE_READY }
  const othersEvent = { event: events.ANOTHER_PLAYER_READY, data: { username } }
  ws.send(JSON.stringify(userEvent))
  ws.publish(lobbyId, JSON.stringify(othersEvent))

  const everyoneReady = await arePlayersReady({ lobbyId })
  if (everyoneReady)
    handleGameStart({ lobbyMetadata })
}

export async function handleNotReady({ ws, playerMetadata }: { ws: ServerWebSocket<{}>, playerMetadata: Player }) {
  const lobbyId = playerMetadata.lobbyId
  const username = playerMetadata.username

  await setPlayerNotReady({ playerMetadata })

  const userEvent = { event: events.YOU_ARE_NOT_READY }
  const othersEvent = { event: events.ANOTHER_PLAYER_NOT_READY, data: { username } }
  ws.send(JSON.stringify(userEvent))
  ws.publish(lobbyId, JSON.stringify(othersEvent))
}

export async function handleCheckInput({ ws, playerMetadata, lobbyMetadata, eventData }: {
  ws: ServerWebSocket<{}>,
  playerMetadata: Player,
  eventData: Record<string, string> | undefined,
  lobbyMetadata: Lobby
}) {
  if (!eventData || !eventData.input || !lobbyMetadata.startTime || lobbyMetadata.gamephase !== "in-game") {
    ws.send(events.INVALID_EVENT_OR_DATA)
  }
  else {
    let character = playerMetadata.character
    const input = eventData.input
    const alphabet = lobbyMetadata.alphabet
    const success = checkCharacter({ character, alphabet, input })

    if (success) {
      const username = playerMetadata.username
      const lobbyId = playerMetadata.lobbyId
      const target = lobbyMetadata.target

      character = selectRandomCharacter(alphabet, character)
      const score = await scoreAndSetupCharacter({ playerMetadata, character })

      if (score == target) {
        await setLobbyPhaseToLobby({ lobbyMetadata })
        await setAllPlayersNotReady({ lobbyMetadata })
        const usedTime = Date.now() - lobbyMetadata.startTime
        const userEvent = { event: events.FINISHED, data: { usedTime } }
        const othersEvent = { event: events.ANOTHER_PLAYER_FINISHED, data: { username, usedTime } }
        ws.send(JSON.stringify(userEvent))
        ws.publish(lobbyId, JSON.stringify(othersEvent))
      }
      else {
        const userEvent = { event: events.SCORED, data: { character } }
        const othersEvent = { event: events.ANOTHER_PLAYER_SCORED, data: { username } }
        ws.send(JSON.stringify(userEvent))
        ws.publish(lobbyId, JSON.stringify(othersEvent))
      }
    }
  }
}

export async function handleKick({ ws, lobbyMetadata, playerMetadata, eventData }: {
  ws: ServerWebSocket<{}>,
  lobbyMetadata: Lobby,
  playerMetadata: Player,
  eventData: Record<string, string> | undefined,
}) {
  if (playerMetadata.sid !== lobbyMetadata.owner || !eventData || !eventData.username) {
    ws.send(events.INVALID_EVENT_OR_DATA)
  }
  else {
    const username = eventData.username
    const lobbyId = lobbyMetadata.lobbyId
    const success = await kickPlayer({ username, lobbyMetadata })
    if (success) {
      const event = { event: events.PLAYER_KICKED, data: { username } }
      app.server?.publish(lobbyId, JSON.stringify(event))
    }
    else
      ws.send(events.INVALID_EVENT_OR_DATA)
  }
}

/**
 * Method responsible for handling the start of the game. Sets the lobby phase to "in-game",
 * and sets the first character of the game of each player (which is the same for everybody).
 *
 * @param lobbyMetadata The metadata of the Lobby
 */
export async function handleGameStart({ lobbyMetadata }: { lobbyMetadata: Lobby }) {
  const NOW = Date.now()
  const BUFFER_MS = 3000
  const startTime = NOW + BUFFER_MS
  const lobbyId = lobbyMetadata.lobbyId
  await lobbyStartUp({ lobbyMetadata, startTime })
  const character = await setupAllPlayersCharacters({ lobbyMetadata })

  let usersEvent = { event: events.LOBBY_STARTING, data: { character, startTime } }
  app.server?.publish(lobbyId, JSON.stringify(usersEvent))
}

export async function handleLeave({ ws, playerMetadata, lobbyMetadata }: {
  ws: ServerWebSocket<{}>,
  playerMetadata: Player,
  lobbyMetadata: Lobby
}) {
  const lobbyId = playerMetadata.lobbyId
  const username = playerMetadata.username
  const sid = playerMetadata.sid
  const before = lobbyMetadata.owner
  const after = await leaveLobby({ lobbyId, sid })

  const userEvent = { event: events.YOU_LEFT }
  const othersEvent = { event: events.ANOTHER_PLAYER_LEFT, data: { username } }
  ws.send(JSON.stringify(userEvent))
  ws.publish(lobbyId, JSON.stringify(othersEvent))

  if (after && before !== after) {
    const afterUsername = await getUsername({ sid: after })
    const event = { event: events.NEW_OWNER, data: { username: afterUsername } }
    app.server?.publish(lobbyId, JSON.stringify(event))
  }
}
