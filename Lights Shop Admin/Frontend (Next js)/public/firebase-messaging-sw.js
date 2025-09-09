// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

// Check if browser supports service workers
const firebaseConfig = {
  apiKey: "AIzaSyD6xCpuj-8v9hC-vfSdOWY-y11Z4VKiu4c",
  authDomain: "virtuallights-1b8db.firebaseapp.com",
  projectId: "virtuallights-1b8db",
  storageBucket: "virtuallights-1b8db.appspot.com",
  messagingSenderId: "953742678972",
  appId: "1:953742678972:web:027007330399cf6f5ea9b9",
  measurementId: "G-EKEZHK4Z8N",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // console.log("Received background message", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
    // badge: "/badge-icon.png",
    tag: payload.notification.tag || "default",
    data: payload.data || {},
    actions: [
      {
        action: "view",
        title: "View",
      },
      {
        action: "dismiss",
        title: "Dismiss",
      },
    ],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
