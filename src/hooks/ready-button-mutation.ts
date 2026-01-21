
import { client } from "@/lib/client"
import { useMutation } from "@tanstack/react-query"

export function useReadyButtonMutation({ isUserReady, onError, onSuccess }: { isUserReady: boolean, onError?: (err: Error) => void, onSuccess?: (isReady: boolean) => void }) {
  const mutation = useMutation({
    mutationFn: async () => {
      if (isUserReady) {
        const { error } = await client.notready.post()
        if (error) {
          throw new Error(error.value.message || "Something went wrong.")
        }
        return false
      }
      else {
        const { error } = await client.ready.post()
        if (error) {
          throw new Error(error.value.message || "Something went wrong.")
        }
        return true
      }
    },
    onError,
    onSuccess,
  })
  return mutation
}

