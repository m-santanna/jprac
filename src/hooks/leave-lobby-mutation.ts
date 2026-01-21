
import { client } from "@/lib/client"
import { useMutation } from "@tanstack/react-query"

export function useLeaveLobbyMutation(onError?: (err: Error) => void) {
  const mutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await client.leave.post()
      if (error) {
        throw new Error(error.value.message || "Something went wrong.")
      }
      return data
    },
    onError,
  })
  return mutation
}

