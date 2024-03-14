import { initializeApp, getApps, getApp} from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getDatabase} from 'firebase/database'

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   databaseURL: "https://my-firebase-d5fc6-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
// };

const firebaseConfig = {
  apiKey: "AIzaSyCokSRyO-A-dl8ITGnpUFGJ63JRxvpkY2Q",
  databaseURL: "https://my-firebase-d5fc6-default-rtdb.asia-southeast1.firebasedatabase.app/",
  authDomain: "my-firebase-d5fc6.firebaseapp.com",
  projectId: "my-firebase-d5fc6",
  storageBucket: "my-firebase-d5fc6.appspot.com",
  messagingSenderId: "22913109291",
  appId: "1:22913109291:web:3a15b4cc9454a0f294896e"
};

// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const database = getDatabase(app)

export {app,auth,database}