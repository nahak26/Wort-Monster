import React, { useEffect } from "react";
import { auth } from "./firebaseConfig.js";
import LoginPage from "./pages/Login.js";
//import WordBuilder from "./pages/WordBuilder.js";
import WordSetManager from "./pages/WordSetManager.js";
import { useUser } from "./context/UserContext.js";

const App = () => {
  const { user, setUser } = useUser();

  // Monitor authentication status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        sessionStorage.setItem("token", token); // Set session token
        // Set the user state
        setUser({
          firebaseUid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          picture: firebaseUser.photoURL,
        });
      } else {
        sessionStorage.removeItem("token");
        setUser(null);
      }
    });
    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  //console.log("Current user data:", user);

  // Show LoginPage if not logged in, else show main app content
  return user ? (
    <WordSetManager user={user} /> // Render the main app content if logged in
  ) : (
    <LoginPage /> // Show Login page if not logged in
  );
};

export default App;
