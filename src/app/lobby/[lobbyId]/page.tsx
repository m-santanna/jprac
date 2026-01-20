"use client";

import LoadingView from "@/app/loading";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRealtime } from "@/lib/realtime-client";
import { useEffect, useState } from "react";
import { client } from "@/lib/client";
import { toast } from "sonner";
import { useJoinLobbyMutation } from "@/hooks/join-lobby-mutation";
import { LobbyState } from "@/types/multiplayer";
import { LobbyView } from "@/components/lobby/lobby-view";
import { CountdownView } from "@/components/lobby/countdown-view";
import { ResultsView } from "@/components/lobby/results-view";
import { GameView } from "@/components/lobby/game-view";

export default function LobbyPage() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const params = useParams()
  const lobbyId = params.lobbyId as string
  const [enabled, setEnabled] = useState(false)
  const [state, setState] = useState<LobbyState>({
    gameState: "LOADING",
    players: [],
    currentUser: { username: "", isReady: false, score: 0 },
    owner: "",
    target: 50,
    capacity: 10,
    alphabet: "hiragana",
    gameData: { currentCharacter: "" },
  })

  useQuery({
    queryKey: ['get-lobby-state', lobbyId],
    queryFn: async () => {
      const { data, error } = await client.lobby({ lobbyId }).state.get()
      if (error) {
        mutation.mutate()
        return null
      }
      setEnabled(true)
      setState((prev) => ({
        ...prev,
        gameState: "LOBBY",
        currentUser: data.user,
        players: data.others,
        target: data.target,
        capacity: data.capacity,
        alphabet: data.alphabet,
        owner: data.owner
      }))
      return data
    },
  })
  const mutation = useJoinLobbyMutation({
    lobbyId,
    onError: (error) => {
      toast.error(error.message)
      router.push('/')
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['get-lobby-state', lobbyId]
      })
    }
  })

  const { status } = useRealtime({
    enabled,
    channels: [lobbyId],
    onData: ({ event, data }) => {
      if (event === "player.joined") {
        toast.info(`${data.username} joined the lobby`)
        setState((prev) => ({
          ...prev,
          players: [...prev.players, { username: data.username, score: 0, isReady: false }],
        }))
      }
      else if (event === "player.left" && data.username === state.currentUser.username) {
        toast.info("You left the lobby.")
        setEnabled(false)
        router.push('/')
      }
      else if (event === "player.left") {
        toast.info(`${data.username} left the lobby`)
        setState((prev) => ({
          ...prev,
          players: prev.players.filter((p) => p.username !== data.username),
        }))
      }
      else if (event === "player.kicked" && data.username === state.currentUser.username) {
        toast.error("You were kicked from the lobby")
        router.push('/')
        setEnabled(false)
      }
      else if (event === "player.kicked") {
        toast.info(`${data.username} was kicked from the lobby`)
        setState((prev) => ({
          ...prev,
          players: prev.players.filter((p) => p.username !== data.username),
        }))
      }
      else if (event === "lobby.changed.owner") {
        toast.info(`${data.username} is now the lobby owner`)
        setState((prev) => ({
          ...prev,
          owner: data.username,
        }))
      }
      else if (event === "lobby.changed.config") {
        setState((prev) => ({
          ...prev,
          target: data.target,
          alphabet: data.alphabet
        }))
      }
      else if (event === "player.ready") {
        data.username === state.currentUser.username
          ? setState((prev) => ({ ...prev, currentUser: { ...prev.currentUser, isReady: true } }))
          : setState((prev) => ({
            ...prev, players: prev.players.map((p) =>
              p.username === data.username ? { ...p, isReady: true } : p
            )
          }))
      }
      else if (event === "player.notready") {
        data.username === state.currentUser.username
          ? setState((prev) => ({ ...prev, gameState: "LOBBY", currentUser: { ...prev.currentUser, isReady: false } }))
          : setState((prev) => ({
            ...prev, players: prev.players.map((p) =>
              p.username === data.username ? { ...p, isReady: false } : p
            )
          }))
      }
      else if (event === "lobby.started") {
        setState((prev) => ({
          ...prev,
          gameState: "COUNTDOWN",
          gameData: {
            ...prev.gameData,
            currentCharacter: data.character,
            startTime: data.startTime,
          },
        }))
      }
      else if (event === "player.scored") {
        data.username === state.currentUser.username
          ? setState((prev) => ({
            ...prev,
            currentUser: {
              ...prev.currentUser,
              score: prev.currentUser.score + 1,
            },
            gameData: {
              ...prev.gameData,
              currentCharacter: data.character,
            },
          }))
          : setState((prev) => ({
            ...prev,
            players: prev.players.map((p) =>
              p.username === data.username ? { ...p, score: p.score + 1 } : p,
            ),
          }))
      }
      else if (event === "player.skipped" && data.username === state.currentUser.username) {
        setState((prev) => ({
          ...prev,
          gameData: {
            ...prev.gameData,
            currentCharacter: data.character,
            characterReceivedAt: Date.now(),
          },
        }))
      }
      else if (event === "player.finished" && data.username === state.currentUser.username) {
        toast.success("Congrats! You won.")
        setState((prev) => ({
          ...prev,
          gameState: "RESULTS",
          gameData: {
            ...prev.gameData,
            finishTime: Date.now(),
            usedTime: data.usedTime,
          },
          currentUser: {
            ...prev.currentUser,
            score: prev.currentUser.score + 1,
            isReady: false,
          },
          players: prev.players.map((p) => ({ ...p, isReady: false })),
        }))
      }
      else if (event === "player.finished") {
        toast.success(`${data.username} won the game!`)
        setState((prev) => ({
          ...prev,
          gameState: "RESULTS",
          gameData: {
            ...prev.gameData,
            finishTime: Date.now(),
            usedTime: data.usedTime,
          },
          currentUser: {
            ...prev.currentUser,
            isReady: false,
          },
          players: prev.players.map((p) =>
            p.username === data.username
              ? ({ ...p, score: p.score + 1, isReady: false })
              : ({ ...p, isReady: false })
          ),
        }))
      }
    },
  })

  useEffect(() => {
    if (state.gameState === "COUNTDOWN" && state.gameData.startTime) {
      const timeUntilStart = state.gameData.startTime - Date.now()
      if (timeUntilStart > 0) {
        const timer = setTimeout(() => {
          setState((prev) => ({ ...prev, gameState: "IN_GAME" }))
        }, timeUntilStart)
        return () => clearTimeout(timer)
      } else {
        setState((prev) => ({ ...prev, gameState: "IN_GAME" }))
      }
    }
  }, [state.gameState, state.gameData.startTime])

  if (state.gameState === "LOADING") {
    return <LoadingView />
  }
  if (state.gameState === "LOBBY") {
    return (
      <LobbyView
        lobbyId={lobbyId}
        players={state.players}
        currentUser={state.currentUser}
        owner={state.owner}
        isConnected={status === "connected"}
        target={state.target}
        alphabet={state.alphabet}
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
      />
    )
  }

  if (state.gameState === "RESULTS") {
    return (
      <ResultsView
        finalStandings={[state.currentUser, ...state.players].sort((a, b) => b.score - a.score)}
        currentUser={state.currentUser}
        usedTime={state.gameData.usedTime!}
      />
    )
  }
}
