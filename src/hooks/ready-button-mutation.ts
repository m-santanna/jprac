
import { client } from "@/lib/client"
import { useMutation } from "@tanstack/react-query"

export function useReadyButtonMutation({ isUserReady, onError }: { isUserReady: boolean, onError?: (err: Error) => void }) {
  const mutation = useMutation({
    mutationFn: async () => {
      if (isUserReady) {
        const { data, error } = await client.notready.post()
        if (error) {
          throw new Error(error.value.message || "Something went wrong.")
        }
        return data
      }
      else {
        const { data, error } = await client.ready.post()
        if (error) {
          throw new Error(error.value.message || "Something went wrong.")
        }
        return data
      }
    },
    onError,
  })
  return mutation
}

