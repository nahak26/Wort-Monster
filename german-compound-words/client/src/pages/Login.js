import React from 'react';
import { auth } from '../firebaseConfig.js'; // Import auth
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Import required functions
import '../styles/LoginPage.css'; // Import custom CSS for additional styling

const LoginPage = () => {
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
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
