import React, { useEffect } from "react";
import { auth } from "./firebaseConfig.js";
import LoginPage from "./pages/Login.js";
import WordSetManager from "./pages/WordSetManager.js"
import { useUser } from "./context/UserContext.js";
import { userCheck, userLogin } from "./service/userService.js";


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

  //User context validation
  useEffect(() => {
    const validateUser = async () => {
      if (!user?.id && user?.firebaseUid) {
        console.log("Validating user...");
        const response = await userCheck(user.firebaseUid);
        //console.log("user data:", response);
        if (response?.id) {
          setUser({ ...user, id: response.id });
        } else {
          console.log("current user id not found, go to login page");
        }
      }
    };

    validateUser();
    //console.log("current user:", user);
  }, [user, setUser]);

  //console.log("Current user data:", user);

  // Show LoginPage if not logged in, else show main app content
  return user?.id ? (
    <WordSetManager user={user} /> // Render the main app content if logged in
  ) : (
    <LoginPage /> // Show Login page if not logged in
  );
};

export default App;
