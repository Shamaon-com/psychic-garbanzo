import "tailwindcss/tailwind.css";
import { Amplify, Auth } from "aws-amplify";
import awsconfig from "../config/aws-exports";
import { AuthContext } from "../utils/functionsLib";
import React, { useState, useEffect } from "react";
import LoadingAnimation from "../components/loadingAnimation";

Amplify.configure(awsconfig);

function MyApp({ Component, pageProps }) {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userSession, setUserSession] = useState(null);
  const [userGroup, setUserGroup] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    console.log("onLoad trigger");

    try {
      const userData = await Auth.currentUserInfo();
      const session = await Auth.currentSession();
      setUserGroup(session.accessToken.payload["cognito:groups"]);
      setUserSession(session);
      setUserData(userData);
      login();
      setIsAuthenticating(false);
    } catch (e) {
      console.log(e);
    }
    setIsAuthenticating(false);
  }

  const login = () => {
    setLoggedIn(true);
  };

  const logout = () => {
    setLoggedIn(false);
  };

  return (
    <>
      {!isAuthenticating ? (
        <AuthContext.Provider
          value={{
            isLoggedIn: isLoggedIn,
            userData: userData,
            userGroup: userGroup,
            login: login,
            logout: logout
          }}
        >
        <Component {...pageProps} /> 
        </AuthContext.Provider>
      ) : (
        <LoadingAnimation />
      )}
    </>
  );
}

export default MyApp;
