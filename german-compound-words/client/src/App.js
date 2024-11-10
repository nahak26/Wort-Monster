import React, { useState, useEffect } from "react";
import { auth } from "./firebaseConfig.js";
import LoginPage from "./pages/Login.js";
import WordBuilder from "./pages/WordBuilder.js";

const App = () => {
  const [user, setUser] = useState(null);

  // Monitor authentication status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); // Set the user state
    });
    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  // Show LoginPage if not logged in, else show main app content
  return user ? (
    <WordBuilder user={user} /> // Render the main app content if logged in
  ) : (
    <LoginPage /> // Show Login page if not logged in
  );
};

export default App;
