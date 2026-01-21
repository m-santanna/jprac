import { client } from "@/lib/client"
import { Alphabet, Target } from "@/types/multiplayer"
import { useMutation } from "@tanstack/react-query"

export function useConfigLobbyMutation({ onError, onSuccess }: { onError?: (err: Error) => void, onSuccess?: () => void }) {
  const mutation = useMutation({
    mutationFn: async ({ lobbyId, alphabet, target }: { lobbyId: string, alphabet: Alphabet, target: Target }) => {
      const { error } = await client.lobby({ lobbyId }).config.post({
        alphabet,
        target
      })
      if (error) throw new Error("Failed to update config")
    },
    onError,
    onSuccess,
  })
  return mutation
}

