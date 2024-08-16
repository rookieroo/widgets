import {initializeApp} from "firebase/app";
import {getMessaging} from "firebase/messaging";

async function sendWebhook(url: string, data: any) {
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

export async function notify(webhook_url: string, message: string) {
  if (!webhook_url) {
    console.error('Please set WEBHOOK_URL')
    return
  }
  return await sendWebhook(webhook_url, {content: message})
}

export async function notify(webhook_url: string, message: string) {

// See: https://firebase.google.com/docs/web/learn-more#config-object
  const firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "PROJECT_ID.firebaseapp.com",
    // The value of `databaseURL` depends on the location of the database
    databaseURL: "https://DATABASE_NAME.firebaseio.com",
    projectId: "PROJECT_ID",
    storageBucket: "PROJECT_ID.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID",
    // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
    measurementId: "G-MEASUREMENT_ID",
  };

// Initialize Firebase
  const app = initializeApp(firebaseConfig);


// Initialize Firebase Cloud Messaging and get a reference to the service
  const messaging = getMessaging(app);
}