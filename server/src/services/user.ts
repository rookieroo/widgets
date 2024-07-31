import {eq} from "drizzle-orm";
import Elysia, {redirect, t} from "elysia";
import {URL} from "url";
import type {DB} from "../_worker";
import {users} from "../db/schema";
import {setup} from "../setup";
import {getDB, getEnv} from "../utils/di";
import {Env} from "../db/db";
import {getBookmarks, getUserInfo} from "../utils/fetch";
import {Google, generateCodeVerifier, generateState} from "arctic";

export function UserService() {
  const db: DB = getDB();
  const env: Env = getEnv();
  const google = new Google(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET,env.GOOGLE_AUTH_CALLBACK)
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  return new Elysia({aot: false})
    .use(setup())
    .group('/user', (group) =>
      group
        .get("/google", async ({oauth2, set, cookie: {redirect_to}}) => {
          // const url = await google.createAuthorizationURL(state, codeVerifier, {
          //   scopes: ["profile", "email"]
          // });
          const url = await oauth2.createURL("Google", {
            scopes: ["profile", "email"]
          });
          url.searchParams.set("access_type", "offline");

          set.redirect = url.href;
        })
        .get("/google/callback", async ({jwt, oauth2, request, set, store, query, cookie: {token, redirect_to, state}}) => {
          const {code} = query
          if (!code || typeof code !== 'string') {
            return new Response('Invalid code', {status: 400})
          }
          // try {
            const tokens = await oauth2.authorize("Google");
            const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
              headers: {
                Authorization: `Bearer ${tokens.accessToken}`
              }
            });
            const user = await response.json();
            // return new Response(JSON.stringify(user), {status: 400})
            // console.log('user', user);
            // send request to API with token
            const profile: {
              openid: string;
              username: string;
              avatar: string;
              email: string;
              permission: number | null;
            } = {
              openid: user.sub,
              username: user.name || user.given_name || user.family_name,
              avatar: user.picture,
              email: user.email,
              permission: 0
            };
            await db.query.users.findFirst({where: eq(users.openid, profile.openid)})
              .then(async (user) => {
                if (user) {
                  profile.permission = user.permission
                  await db.update(users).set(profile).where(eq(users.id, user.id));
                  token.set({
                    value: await jwt.sign({id: user.id}),
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                    path: '/',
                  })
                } else {
                  // if no user exists, set permission to 1
                  // store.anyUser is a global state to cache the existence of any user
                  if (!await store.anyUser(db)) {
                      const realTimeCheck = (await db.query.users.findMany())?.length > 0
                      if (!realTimeCheck) {
                          profile.permission = 1
                          store.anyUser = async (_: DB) => true
                      }
                  }
                  const result = await db.insert(users).values(profile).returning({insertedId: users.id});
                  if (!result || result.length === 0) {
                    throw new Error('Failed to register');
                  } else {
                    token.set({
                      value: await jwt.sign({id: result[0].insertedId}),
                      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                      path: '/',
                    })
                  }
                }
              });
            const redirect_host = redirect_to.value || request.headers.get('referer').slice(0, -1) || ""
            const redirect_url = (`${redirect_host}/callback?token=${token.value}`);
            set.headers = {
              'Content-Type': 'text/html',
            }
            set.redirect = redirect_url
          // } catch (error) {
          //   console.error('Error in callback:', error)
          //   return new Response('Authentication failed', {status: 500})
          // }
        })
        .get("/github", ({oauth2, headers: {referer}, cookie: {redirect_to}}) => {
          if (!referer) {
            return 'Referer not found'
          }
          const referer_url = new URL(referer)
          redirect_to.value = `${referer_url.protocol}//${referer_url.host}`
          return oauth2.redirect("GitHub", {scopes: ["read:user"]})
        })
        .get("/github/callback", async ({jwt, oauth2, set, store, query, cookie: {token, redirect_to, state}}) => {

          console.log('state', state.value)
          console.log('p_state', query.state)

          const gh_token = await oauth2.authorize("GitHub");
          // request https://api.github.com/user for user info
          const response = await fetch("https://api.github.com/user", {
            headers: {
              Authorization: `Bearer ${gh_token.accessToken}`,
              Accept: "application/json",
              "User-Agent": "elysia"
            },
          });
          const user: any = await response.json();
          const profile: {
            openid: string;
            username: string;
            avatar: string;
            permission: number | null;
          } = {
            openid: user.id,
            username: user.name || user.login,
            avatar: user.avatar_url,
            permission: 0
          };
          await db.query.users.findFirst({where: eq(users.openid, profile.openid)})
            .then(async (user) => {
              if (user) {
                profile.permission = user.permission
                await db.update(users).set(profile).where(eq(users.id, user.id));
                token.set({
                  value: await jwt.sign({id: user.id}),
                  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                  path: '/',
                })
              } else {
                // if no user exists, set permission to 1
                // store.anyUser is a global state to cache the existence of any user
                if (!await store.anyUser(db)) {
                  const realTimeCheck = (await db.query.users.findMany())?.length > 0
                  if (!realTimeCheck) {
                    profile.permission = 1
                    store.anyUser = async (_: DB) => true
                  }
                }
                const result = await db.insert(users).values(profile).returning({insertedId: users.id});
                if (!result || result.length === 0) {
                  throw new Error('Failed to register');
                } else {
                  token.set({
                    value: await jwt.sign({id: result[0].insertedId}),
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                    path: '/',
                  })
                }
              }
            });
          const redirect_host = redirect_to.value || ""
          const redirect_url = (`${redirect_host}/callback?token=${token.value}`);
          set.headers = {
            'Content-Type': 'text/html',
          }
          set.redirect = redirect_url
        }, {
          query: t.Object({
            state: t.String(),
            code: t.String(),
          })
        })
        .get('/profile', async ({set, uid}) => {
          if (!uid) {
            set.status = 403
            return 'Permission denied'
          }
          const uid_num = parseInt(uid)
          const user = await db.query.users.findFirst({where: eq(users.id, uid_num)})
          if (!user) {
            set.status = 404
            return 'User not found'
          }
          return {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            permission: user.permission === 1,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          }
        })
    )
}