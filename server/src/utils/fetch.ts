import {OAuth2Client} from "google-auth-library";

export async function getUserInfo(auth: OAuth2Client) {
  const userInfoResponse = await auth.request({
    url: 'https://www.googleapis.com/oauth2/v3/userinfo'
  })
  return userInfoResponse.data
}

export async function getBookmarks(auth: OAuth2Client) {
  const res = await fetch(
    'https://www.googleapis.com/chrome/sync/v1/bookmarks',
    {
      headers: {
        Authorization: `Bearer ${auth.credentials.access_token}`
      }
    }
  )
  const bookmarksResponse = await res.json();
  return bookmarksResponse.data.bookmarks || []
}