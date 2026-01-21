import { client } from "@/lib/client"
import { useMutation } from "@tanstack/react-query"

export function useKickPlayerMutation({ onError, onSuccess }: { onError?: (err: Error) => void, onSuccess?: (username: string) => void }) {
  const mutation = useMutation({
    mutationFn: async ({ username, lobbyId }: { username: string, lobbyId: string }) => {
      const { error } = await client.kick.post({ lobbyId, username })
      if (error) {
        throw new Error(error.value.message || "Something went wrong.")
      }
      return username
    },
    onError,
    onSuccess,
  })
  return mutation
}

