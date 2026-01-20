import { Realtime, InferRealtimeEvents } from "@upstash/realtime"
import { redis } from "@/lib/redis"
import { eventsSchema } from "@/types/events"

export const realtime = new Realtime({ schema: eventsSchema, redis, history: { expireAfterSecs: 60 * 60 * 2 } })
export type RealtimeEvents = InferRealtimeEvents<typeof realtime>
