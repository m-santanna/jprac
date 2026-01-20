import z from "zod";
import { alphabetSchema, targetSchema } from "./multiplayer";

export const eventsSchema = {
  player: {
    joined: z.object({
      username: z.string()
    }),
    ready: z.object({
      username: z.string()
    }),
    notready: z.object({
      username: z.string()
    }),
    scored: z.object({
      username: z.string(),
      character: z.string()
    }),
    finished: z.object({
      username: z.string(),
      usedTime: z.number()
    }),
    skipped: z.object({
      username: z.string(),
      character: z.string()
    }),
    kicked: z.object({
      username: z.string()
    }),
    left: z.object({
      username: z.string()
    })
  },
  lobby: {
    started: z.object({
      character: z.string(),
      startTime: z.number()
    }),
    changed: {
      owner: z.object({
        username: z.string()
      }),
      config: z.object({
        target: targetSchema,
        alphabet: alphabetSchema,
      })
    }
  }
}

