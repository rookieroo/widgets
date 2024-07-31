import Elysia, {t} from "elysia";
import type {DB} from "../_worker";
import {setup} from "../setup";
import {getDB} from "../utils/di";

export function UserService() {
  const db: DB = getDB();
  return new Elysia({aot: false})
    .use(setup())
    .group('/auth', (group) =>
      group
        .get("/google", async ({oauth2, set}) => {
          const url = await oauth2.createURL("Google");
          url.searchParams.set("access_type", "offline");

          set.redirect = url.href;
        })
        .get("/auth/google/callback", async ({oauth2}) => {
          const token = await oauth2.authorize("Google");

          // send request to API with token
        })
    )
}