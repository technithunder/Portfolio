import { firebaseConfig } from "@/firebase/firebaseConfig";
import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";

const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAP_ID;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let messaging;

// Modified initialization with browser support check
const initializeMessaging = async () => {
  if (typeof window !== "undefined") {
    const supported = await isSupported();
    if (supported) {
      messaging = getMessaging(app);
    } else {
      console.warn("This browser doesn't support Firebase Messaging");
    }
  }
  return messaging;
};

// Initialize messaging when the file loads
initializeMessaging();

// Exported function to request FCM token
export const requestFCMToken = async () => {
  try {
    if (!messaging) {
      const supported = await isSupported();
      if (!supported) {
        throw new Error("Browser doesn't support Firebase Messaging");
      }
      messaging = getMessaging(app);
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, { vapidKey });
      return token;
    } else {
      throw new Error("Notification permission not granted");
    }
  } catch (err) {
    console.error("Error getting FCM token:", err);
    throw err;
  }
};

export const onMessageListener = (callback) => {
  return new Promise(async (resolve, reject) => {
    if (!messaging) {
      const supported = await isSupported();
      if (!supported) {
        return reject("Browser doesn't support Firebase Messaging");
      }
      messaging = getMessaging(app);
    }

    // Set up the listener that will call the callback for each message
    const unsubscribe = onMessage(messaging, (payload) => {
      if (callback) {
        callback(payload);
      }
    });

    // Resolve with the unsubscribe function
    resolve(unsubscribe);
  });
};
