import { z } from "zod";

export const sessionPayloadSchema = z.object({
  sid: z.string(),
  lobbyId: z.string(),
  username: z.string()
})

export type SessionPayload = z.infer<typeof sessionPayloadSchema>
