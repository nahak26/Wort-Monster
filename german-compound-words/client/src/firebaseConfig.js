import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChh_Mor-VbJQ7aGAaomY6hl9XaPi7Kj9I",
  authDomain: "wort-monster.firebaseapp.com",
  projectId: "wort-monster",
  storageBucket: "wort-monster.appspot.com",
  messagingSenderId: "639622162800",
  appId: "1:639622162800:web:723441ed3be049439e47b5",
  measurementId: "G-VW0E2GD4KR"
};

// Initialize Firebase and Authentication
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export both app and auth
export { app, auth };
