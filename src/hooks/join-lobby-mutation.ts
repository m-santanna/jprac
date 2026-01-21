import { client } from "@/lib/client"
import { useMutation } from "@tanstack/react-query"

export function useJoinLobbyMutation({ lobbyId, onError, onSuccess }: { lobbyId: string, onError?: (err: Error) => void, onSuccess?: (lobbyId: string) => void }) {
  const mutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await client.join({ lobbyId }).post()
      if (error) {
        throw new Error(error.value.message || "Something went wrong.")
      }
      return data.lobbyId
    },
    onError,
    onSuccess,
  })
  return mutation
}

