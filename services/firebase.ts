import { initializeApp } from "firebase/app";
import { Auth, getAuth, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// On native (iOS/Android), use AsyncStorage for persistence so auth state
// survives app restarts. On web, fall back to getAuth which uses
// localStorage automatically — getReactNativePersistence doesn't exist there.
let auth: Auth;
if (Platform.OS !== "web") {
  const { getReactNativePersistence } = require("firebase/auth");
  const ReactNativeAsyncStorage =
    require("@react-native-async-storage/async-storage").default;
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } catch (e: any) {
    // auth/already-initialized is thrown on Fast Refresh — just grab the
    // existing instance instead of creating a new one.
    if (e?.code === "auth/already-initialized") {
      auth = getAuth(app);
    } else {
      throw e;
    }
  }
} else {
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
export const functions = getFunctions(app);
export default app;
