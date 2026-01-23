"use client"

import LoadingView from "@/app/loading"
import { useParams, useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { useRealtime } from "@/lib/realtime-client"
import { useEffect, useRef, useState } from "react"
import { client } from "@/lib/client"
import { toast } from "sonner"
import { useJoinLobbyMutation } from "@/hooks/join-lobby-mutation"
import { LobbyState, PublicPlayer } from "@/types/multiplayer"
import { LobbyView } from "@/components/lobby/lobby-view"
import { CountdownView } from "@/components/lobby/countdown-view"
import { ResultsView } from "@/components/lobby/results-view"
import { GameView } from "@/components/lobby/game-view"
import { produce } from "immer"

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

  // Ref to avoid stale closure issues in realtime callback
  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  }, [state])

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
      // Use ref to get current state values (avoids stale closure)
      const currentUsername = stateRef.current.currentUser.username

      if (event === "player.joined") {
        // Skip if it's ourselves or player already exists (deduplication)
        if (data.username === currentUsername) return
        setState(produce((draft) => {
          if (!draft.players.some(p => p.username === data.username)) {
            toast.info(`${data.username} joined the lobby`)
            draft.players.push({ username: data.username, score: 0, isReady: false })
          }
        }))
      }
      else if (event === "player.left") {
        if (data.username === currentUsername) {
          toast.info("You left the lobby.")
          setState(produce((draft) => {
            draft.realtimeEnabled = false
          }))
          router.push('/')
        }
        else {
          toast.info(`${data.username} left the lobby`)
          setState(produce((draft) => {
            draft.players = draft.players.filter((p) => p.username !== data.username)
          }))
        }
      }
      else if (event === "player.kicked") {
        if (data.username === currentUsername) {
          toast.error("You were kicked from the lobby")
          setState(produce((draft) => {
            draft.realtimeEnabled = false
          }))
          router.push('/')
        }
        else {
          setState(produce((draft) => {
            draft.players = draft.players.filter((p) => p.username !== data.username)
          }))
          toast.info(`${data.username} was kicked from the lobby`)
        }
      }
      else if (event === "lobby.changed.owner") {
        if (data.username === currentUsername) {
          toast.info("You are now the lobby owner")
          setState(produce((draft) => {
            draft.currentUser.isReady = false
            draft.owner = data.username
          }))
        }
        else {
          toast.info(`${data.username} is now the lobby owner`)
          setState(produce((draft) => {
            const player = draft.players.find((p) => p.username === data.username)
            if (player) player.isReady = false
            draft.owner = data.username
          }))
        }
      }
      else if (event === "lobby.changed.config") {
        // Only show toast if not the owner (owner already knows they changed it)
        const isOwner = stateRef.current.owner === currentUsername
        if (!isOwner) {
          toast.info("Lobby settings updated!")
        }
        setState(produce((draft) => {
          draft.target = data.target
          draft.alphabet = data.alphabet
        }))
      }
      else if (event === "player.ready") {
        setState(produce((draft) => {
          if (data.username === draft.currentUser.username) {
            draft.currentUser.isReady = true
            draft.currentUser.score = 0
          }
          else {
            const player = draft.players.find((p) => p.username === data.username)
            if (player) {
              player.isReady = true
              player.score = 0
            }
          }
        }))
      }
      else if (event === "player.notready") {
        setState(produce((draft) => {
          if (data.username === draft.currentUser.username) {
            draft.currentUser.isReady = false
          }
          else {
            const player = draft.players.find((p) => p.username === data.username)
            if (player) player.isReady = false
          }
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
        setState(produce((draft) => {
          if (data.username === draft.currentUser.username) {
            draft.currentUser.score += 1
            draft.gameData.currentCharacter = data.character
          }
          else {
            const player = draft.players.find((p) => p.username === data.username)
            if (player) player.score += 1
          }
        }))
      }
      else if (event === "player.skipped") {
        setState(produce((draft) => {
          if (data.username === draft.currentUser.username) {
            draft.gameData.currentCharacter = data.character
          }
        }))
      }
      else if (event === "player.finished") {
        // Compute final standings inside setState to avoid stale state
        setState(produce((draft) => {
          // Update scores first
          if (data.username === draft.currentUser.username) {
            draft.currentUser.score += 1
          }
          else {
            const player = draft.players.find((p) => p.username === data.username)
            if (player) player.score += 1
          }

          // Compute final standings from draft (current) state
          const allPlayers = [
            { ...draft.currentUser },
            ...draft.players.map(p => ({ ...p }))
          ].sort((a, b) => b.score - a.score)

          // Update game state
          draft.gameState = "RESULTS"
          draft.gameData.finishTime = Date.now()
          draft.gameData.usedTime = data.usedTime

          // Reset for next game
          draft.currentUser.score = 0
          draft.currentUser.isReady = false
          for (const player of draft.players) {
            player.isReady = false
            player.score = 0
          }

          // Set final standings (this is a side effect but needed)
          setFinalStandings(allPlayers)
        }))

        // Show appropriate toast
        if (data.username === currentUsername)
          toast.success("Congrats! You won.")
        else
          toast.success(`${data.username} won the game!`)
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
      }
      else {
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
