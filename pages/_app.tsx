import "tailwindcss/tailwind.css";
import { Amplify, Auth } from "aws-amplify";
import awsconfig from "../config/aws-exports";
import { useRouter } from 'next/router';

import React, { useState, useEffect } from "react";
import LoadingAnimation from "../components/loadingAnimation";
import type { AppProps /*, AppContext */ } from 'next/app'
import { AuthContext } from "../utils/functionsLib";





Amplify.configure(awsconfig);




function MyApp({ Component, pageProps }: AppProps) {
  

  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [attributes, setAttributes] = useState({})

  const router = useRouter();

  useEffect(() => {

    async function onLoad() {
      try {
        const userData = await Auth.currentUserInfo();
        setAttributes(userData.attributes);
        const session = await Auth.currentSession();
        setIsAdmin(session.accessToken.payload['cognito:groups'].includes("admins"));
        setIsLoggedIn(true);
        setIsAuthenticating(false);
      } catch (e) {
        setIsAuthenticating(false);
      }
    }
    onLoad();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const user = await Auth.signIn(username, password);
      setIsAdmin(user.signInUserSession.accessToken.payload['cognito:groups'].includes("admins"))
      setAttributes(user.attributes);
      setIsLoggedIn(true);
      router.push("/");
    }
    catch(e){
      alert(e.message);
    }
  }

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      {!isAuthenticating ? (
        <AuthContext.Provider
          value={{
            isLoggedIn: isLoggedIn,
            isAdmin: isAdmin,
            attributes: attributes,
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
