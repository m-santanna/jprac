import { t } from "elysia";

export const SESSION_COOKIE_SCHEMA = {
  cookie: t.Cookie({
    session: t.Optional(t.String()),
  }),
}
