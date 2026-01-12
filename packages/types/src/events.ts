/**
 * Documentation on what each event means, and where they should be used:
 *
 * @param INVALID_EVENT_OR_DATA Event sent from the server, when the event received is not valid, or the data inside isn't.
 * @param LOBBY_STARTING Event sent from the server, indicating the server is starting the lobby. Also sends the first character of the game.
 * @param READY Event triggered by the client, where they pressed the ready button, and are waiting for the server to respond.
 * @param NOT_READY Event triggered by the client, where they pressed the not ready button, also waiting for the server.
 * @param LEAVE Event triggered by the client, where they pressed the leave button, also waiting for the server.
 * @param JOINED Event sent from the server to the client, confirming the client joined the lobby.
 * @param YOU_ARE_READY Event sent from the server to the client, confirming the client state is ready.
 * @param YOU_ARE_NOT_READY Event sent from the server to the client, confirming the client state is not ready.
 * @param ANOTHER_PLAYER_JOINED Event sent from the server to the clients subscribed in the specific lobby, informing another player joined the lobby.
 * @param ANOTHER_PLAYER_READY Event sent from the server to the clients subscribed in the specific lobby, informing another player state is now ready.
 * @param ANOTHER_PLAYER_NOT_READY Event sent from the server to the clients subscribed in the specific lobby, informing another player state is now not ready.
 * @param ANOTHER_PLAYER_LEFT Event sent from the server to the clients subscribed in the specific lobby, informing another player left the lobby.
 * @param LOBBY_DESTROYED Event sent from the server to the clients subscribed in the specific lobby, informing the lobby was destroyed (the owner left).
 * @param CHECK_INPUT Event sent from the client, where they send their character and their input, and waits for the server to confirm if they scored or not.
 * @param SCORED Event sent from the server to the client, confirming the player scored, and sending their new character.
 * @param ANOTHER_PLAYER_SCORED Event sent from the server to the clients subscribed in the specific lobby, informing another player scored their current character.
 * @param SCORED Event sent from the server to the client, informing the player is done with the game.
 * @param ANOTHER_PLAYER_SCORED Event sent from the server to the clients subscribed in the specific lobby, informing another player finished the game.
 */
export const events = {
  INVALID_EVENT_OR_DATA: "INVALID_EVENT_OR_DATA",
  LOBBY_STARTING: "LOBBY_STARTING",
  READY: "READY",
  NOT_READY: "NOT_READY",
  LEAVE: "LEAVE",
  JOINED: "JOINED",
  YOU_ARE_READY: "YOU_ARE_READY",
  YOU_ARE_NOT_READY: "YOU_ARE_NOT_READY",
  YOU_LEFT: "YOU_LEFT",
  ANOTHER_PLAYER_JOINED: "ANOTHER_PLAYER_JOINED",
  ANOTHER_PLAYER_READY: "ANOTHER_PLAYER_READY",
  ANOTHER_PLAYER_NOT_READY: "ANOTHER_PLAYER_NOT_READY",
  ANOTHER_PLAYER_LEFT: "ANOTHER_PLAYER_LEFT",
  LOBBY_DESTROYED: "LOBBY_DESTROYED",
  CHECK_INPUT: "CHECK_INPUT",
  SCORED: "SCORED",
  ANOTHER_PLAYER_SCORED: "ANOTHER_PLAYER_SCORED",
  FINISHED: "FINISHED",
  ANOTHER_PLAYER_FINISHED: "FINISHED",
}
