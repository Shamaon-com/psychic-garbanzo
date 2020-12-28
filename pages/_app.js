import "tailwindcss/tailwind.css";
import { Amplify, Auth } from "aws-amplify";
import awsconfig from "../config/aws-exports";
import { AuthContext } from "../utils/functionsLib";
import React, { useState, useEffect} from "react";

Amplify.configure(awsconfig);

function MyApp({ Component, pageProps }) {

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isAuthenticating, setIsAuthenticating ] = useState(true);

  
  useEffect(() => {
     onLoad();
  }, []);
  
  async function onLoad() {
    try {
      const data = await Auth.currentSession();
      login();
      setUserData(data);
      setIsAuthenticating(false);
    }
    catch(e) {
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
    <AuthContext.Provider value={{isLoggedIn: isLoggedIn, userData: userData, login: login, logout: logout}}>
      {!isAuthenticating ? (
        <Component {...pageProps} />
      ) : (
        <div>
          loading
        </div>
      )}
    </AuthContext.Provider>
  );
}

export default MyApp;
