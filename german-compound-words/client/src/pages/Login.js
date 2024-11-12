import React from 'react';
import { auth } from '../firebaseConfig.js';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { supabase } from '../supabaseClient'; // Import Supabase client
import { upsertUser } from '../lib/dbClient'; // Import upsertUser function
import '../styles/LoginPage.css';

const LoginPage = () => {
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // Sign in with Google and retrieve the Firebase user token
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      
      // Retrieve Firebase user details
      const { uid, displayName, email, photoURL } = result.user;
      
      // Upsert user in Supabase with the Firebase UID, name, email, and picture
      await upsertUser(uid, displayName, email, photoURL);

      // Set Supabase auth token
      await supabase.auth.setAuth(token);

      console.log("User logged in and synced with Supabase!");
    } catch (error) {
      console.error("Error logging in with Google", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Willkommen zu Wort Monster!</h1>
        <p>Learn German in a fun and interactive way. Log in to get started!</p>
        <button onClick={handleGoogleLogin} className="google-login-button">
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
