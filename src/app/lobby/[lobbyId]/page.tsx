"use client";

import LoadingView from "@/app/loading";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useRealtime } from "@/lib/realtime-client";
import { useEffect, useState } from "react";
import { client } from "@/lib/client";
import { toast } from "sonner";
import { useJoinLobbyMutation } from "@/hooks/join-lobby-mutation";
import { LobbyState, PublicPlayer } from "@/types/multiplayer";
import { LobbyView } from "@/components/lobby/lobby-view";
import { CountdownView } from "@/components/lobby/countdown-view";
import { ResultsView } from "@/components/lobby/results-view";
import { GameView } from "@/components/lobby/game-view";
import { produce } from "immer";

export default function LobbyPage() {
  const router = useRouter()
  const params = useParams()
  const lobbyId = params.lobbyId as string
  const [state, setState] = useState<LobbyState>({
    gameState: "LOBBY",
    realtimeEnabled: false,
    loading: true,
    players: [],
    currentUser: { username: "", isReady: false, score: 0 },
    target: 50,
    capacity: 10,
    alphabet: "hiragana",
    owner: "",
    gameData: { currentCharacter: "" },
  })
  const [finalStandings, setFinalStandings] = useState<PublicPlayer[]>([])

  useEffect(() => {
    stateMutation.mutate()
  }, [])

  const stateMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await client.lobby({ lobbyId }).state.get()
      if (error)
        throw new Error(error.value.message)
      return data
    },
    onSuccess: (data) => {
      setState(produce((draft) => {
        draft.realtimeEnabled = true
        draft.gameState = data.gamephase === "in-game" ? "IN_GAME" : "LOBBY"
        draft.currentUser = data.user
        draft.players = data.others
        draft.target = data.target
        draft.capacity = data.capacity
        draft.alphabet = data.alphabet
        draft.owner = data.owner
        draft.gameData = { currentCharacter: data.character, startTime: data.startTime }
      }))
    },
    onError: () => joinMutation.mutate()
  })
  const joinMutation = useJoinLobbyMutation({
    lobbyId,
    onError: (error) => {
      toast.error(error.message)
      router.push('/')
    },
    onSuccess: () => stateMutation.mutate()
  })

  const { status } = useRealtime({
    enabled: state.realtimeEnabled,
    channels: [lobbyId],
    onData: ({ event, data }) => {
      if (event === "player.joined") {
        toast.info(`${data.username} joined the lobby`)
        setState(produce((draft) => {
          draft.players.push({ username: data.username, score: 0, isReady: false })
        }))
      }
      // else if (event === "player.left" && data.username === state.currentUser.username) 
      // We don't need to care about ourselves! That is handled when the player clicks on the button.
      else if (event === "player.left") {
        toast.info(`${data.username} left the lobby`)
        setState(produce((draft) => {
          draft.players = draft.players.filter((p) => p.username !== data.username)
        }))
      }
      else if (event === "player.kicked" && data.username === state.currentUser.username) {
        toast.error("You were kicked from the lobby")
        setState(produce((draft) => {
          draft.realtimeEnabled = false
        }))
        router.push('/')
      }
      // else if (event === "player.kicked")
      // Also don't need to care. Handled when the owner kicks someone.
      else if (event === "lobby.changed.owner" && data.username === state.currentUser.username) {
        toast.info("You are now the lobby owner")
        setState(produce((draft) => {
          draft.currentUser.isReady = false
          draft.owner = data.username
        }))
      }
      else if (event === "lobby.changed.owner") {
        toast.info(`${data.username} is now the lobby owner`)
        setState(produce((draft) => {
          const player = draft.players.find((p) => p.username === data.username)
          if (player) player.isReady = false
          draft.owner = data.username
        }))
      }
      else if (event === "lobby.changed.config") {
        setState(produce((draft) => {
          draft.target = data.target
          draft.alphabet = data.alphabet
        }))
      }
      else if (event === "player.ready" && data.username !== state.currentUser.username) {
        // Don't need to handle ourselves. When button pressed, state updated.
        setState(produce((draft) => {
          const player = draft.players.find((p) => p.username === data.username)
          if (player) {
            player.isReady = true
            player.score = 0
          }
        }))
      }
      else if (event === "player.notready" && data.username !== state.currentUser.username) {
        // Don't need to handle ourselves. When button pressed, state updated.
        setState(produce((draft) => {
          const player = draft.players.find((p) => p.username === data.username)
          if (player) player.isReady = false
        }))
      }
      else if (event === "lobby.started") {
        setState(produce((draft) => {
          draft.gameState = "COUNTDOWN"
          draft.gameData.currentCharacter = data.character
          draft.gameData.startTime = data.startTime
        }))
      }
      else if (event === "player.scored") {
        if (data.username === state.currentUser.username) {
          setState(produce((draft) => {
            draft.currentUser.score += 1
            draft.gameData.currentCharacter = data.character
          }))
        } else {
          setState(produce((draft) => {
            const player = draft.players.find((p) => p.username === data.username)
            if (player) player.score += 1
          }))
        }
      }
      else if (event === "player.skipped" && data.username === state.currentUser.username) {
        setState(produce((draft) => {
          draft.gameData.currentCharacter = data.character
        }))
      }
      else if (event === "player.finished" && data.username === state.currentUser.username) {
        const updatedUser = { ...state.currentUser, score: state.currentUser.score + 1 }
        setFinalStandings([updatedUser, ...state.players].sort((a, b) => b.score - a.score))
        toast.success("Congrats! You won.")
        setState(produce((draft) => {
          draft.gameState = "RESULTS"
          draft.gameData.finishTime = Date.now()
          draft.gameData.usedTime = data.usedTime
          draft.currentUser.score = 0
          draft.currentUser.isReady = false
          for (const player of draft.players) {
            player.isReady = false
            player.score = 0
          }
        }))
      }
      else if (event === "player.finished") {
        const updatedPlayers = state.players.map((p) =>
          p.username === data.username ? { ...p, score: p.score + 1 } : p
        )
        setFinalStandings([state.currentUser, ...updatedPlayers].sort((a, b) => b.score - a.score))
        toast.success(`${data.username} won the game!`)
        setState(produce((draft) => {
          draft.gameState = "RESULTS"
          draft.gameData.finishTime = Date.now()
          draft.gameData.usedTime = data.usedTime
          draft.currentUser.isReady = false
          draft.currentUser.score = 0
          for (const player of draft.players) {
            player.score = 0
            player.isReady = false
          }
        }))
      }
    },
  })

  useEffect(() => {
    if (status === "connected")
      setState(produce((draft) => { draft.loading = false }))
    else
      setState(produce((draft) => { draft.loading = true }))
  }, [status])

  useEffect(() => {
    if (state.gameState === "COUNTDOWN" && state.gameData.startTime) {
      const timeUntilStart = state.gameData.startTime - Date.now()
      if (timeUntilStart > 0) {
        const timer = setTimeout(() => {
          setState(produce((draft) => { draft.gameState = "IN_GAME" }))
        }, timeUntilStart)
        return () => clearTimeout(timer)
      } else {
        setState(produce((draft) => { draft.gameState = "IN_GAME" }))
      }
    }
  }, [state.gameState, state.gameData.startTime])

  if (state.loading) {
    return <LoadingView />
  }
  if (state.gameState === "LOBBY") {
    return (
      <LobbyView
        lobbyId={lobbyId}
        players={state.players}
        currentUser={state.currentUser}
        owner={state.owner}
        target={state.target}
        alphabet={state.alphabet}
        setState={setState}
      />
    )
  }

  if (state.gameState === "COUNTDOWN") {
    return (
      <CountdownView
        startTime={state.gameData.startTime!}
      />
    )
  }

  if (state.gameState === "IN_GAME") {
    return (
      <GameView
        character={state.gameData.currentCharacter}
        currentUser={state.currentUser}
        players={state.players}
        target={state.target}
        alphabet={state.alphabet}
      />
    )
  }

  if (state.gameState === "RESULTS") {
    return (
      <ResultsView
        setState={setState}
        finalStandings={finalStandings}
        currentUser={state.currentUser}
        usedTime={state.gameData.usedTime!}
      />
    )
  }
}
