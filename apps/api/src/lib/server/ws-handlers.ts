import { Lobby, Player } from "@repo/types/multiplayer";
import { ServerWebSocket } from "elysia/ws/bun";
import { arePlayersReady } from "../redis/getters";
import { events } from "@repo/types/events";
import { checkCharacter, selectRandomCharacter } from "@repo/alphabets/alphabets";
import { incrementScore, setLobbyInGame, setPlayerNotReady, setPlayerReady, setupAllPlayersCharacters, setupCharacter } from "../redis/setters";
import { app } from "@/index";
import { startCountdown } from "./helpers";


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

export async function handleCheckInput({ ws, playerMetadata, eventData, lobbyMetadata }: {
  ws: ServerWebSocket<{}>,
  playerMetadata: Player,
  eventData: Record<string, string> | undefined,
  lobbyMetadata: Lobby
}) {
  if (!eventData || !eventData.input) {
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

      character = selectRandomCharacter(alphabet, character)
      await incrementScore({ playerMetadata, })
      await setupCharacter({ playerMetadata, character })

      const userEvent = { event: events.SCORED, data: { character } }
      const othersEvent = { event: events.ANOTHER_PLAYER_SCORED, data: { username } }
      ws.send(JSON.stringify(userEvent))
      ws.publish(lobbyId, JSON.stringify(othersEvent))
    }
  }
}

/**
 * Method responsible for handling the start of the game. Sets the lobby phase to "in-game",
 * and sets the first character of the game of each player (which is the same for everybody).
 *
 * @param lobbyMetadata The metadata of the Lobby
 */
export async function handleGameStart({ lobbyMetadata }: { lobbyMetadata: Lobby }) {
  const lobbyId = lobbyMetadata.lobbyId
  await setLobbyInGame({ lobbyMetadata })
  const character = await setupAllPlayersCharacters({ lobbyMetadata })

  let usersEvent = { event: events.LOBBY_STARTING, data: { character } }
  app.server?.publish(lobbyId, JSON.stringify(usersEvent))

  startCountdown(3, timeLeft => app.server?.publish(lobbyId, `${timeLeft}`), () => app.server?.publish(lobbyId, "started!!"))
}

