import jwt from "@elysiajs/jwt"
import { t } from "elysia"

export const serverJWT = jwt({
  name: "jwt",
  secret: process.env.JWT_SECRET!,
  schema: t.Object({
    sid: t.String(),
    username: t.String(),
    lobbyId: t.String(),
  })
})

export type ElysiaJWT = typeof serverJWT.decorator.jwt
