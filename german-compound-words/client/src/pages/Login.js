import React from 'react';
import { auth } from '../firebaseConfig.js'; // Import auth
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Import required functions
import '../styles/LoginPage.css'; // Import custom CSS for additional styling
import { userLogin } from '../service/userService.js';
import { useUser } from '../context/UserContext.js';
//import { supabase } from '../supabaseClient'; // Import Supabase client

const LoginPage = () => {
  const { setUser } = useUser();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const { uid, displayName: name, email, photoURL: picture} = result.user;
      const response = await userLogin({uid, name, email, picture});
      /* for future strict error handling
      if (!response.success) {
        console.error("Error syncing with database", response.error);
      }
      */
      //update user data in context
      setUser({
        id: response.id,
        name,
        email,
        picture
      });
/*
      // Set Supabase auth token
      await supabase.auth.setAuth(token);

      console.log("User logged in and synced with Supabase!");
*/
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
