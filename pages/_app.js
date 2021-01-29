import "tailwindcss/tailwind.css";
import { Amplify, Auth, API, graphqlOperation } from "aws-amplify";
import awsconfig from "../config/aws-exports";
import { useRouter } from 'next/router';

import React, { useState, useEffect } from "react";
import LoadingAnimation from "../components/loadingAnimation";

import { AuthContext } from "../utils/functionsLib";

import * as queries from "../config/graphql/queries";



Amplify.configure(awsconfig);




function MyApp({ Component, pageProps }) {
  

  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [attributes, setAttributes] = useState({});
  const [generalSettings, setGeneralSettings] = useState({});

  const router = useRouter();

  useEffect(() => {

    async function onLoad() {
      try {
        const userData = await Auth.currentUserInfo();
        setAttributes(userData.attributes);
        const session = await Auth.currentSession();
        setIsAdmin((session).accessToken.payload['cognito:groups'].includes("admins"));
        getPageSettings();
        setIsLoggedIn(true);
        setIsAuthenticating(false);
      } catch (e) {
        setIsAuthenticating(false);
      }
    }
    onLoad();
  }, []);

  const login = async (username, password) => {
    try {
      const user = await Auth.signIn(username, password);
      setIsAdmin(user.signInUserSession.accessToken.payload['cognito:groups'].includes("admins"))
      setAttributes(user.attributes);
      getPageSettings();
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

  const getPageSettings = () => {
    API.graphql(graphqlOperation(queries.listGeneralSettingss)).then((data) => {
      setGeneralSettings(data.data.listGeneralSettingss.items)
    }
      
    );
  }


  return (
    <>
      {!isAuthenticating ? (
        <AuthContext.Provider
          value={{
            isLoggedIn: isLoggedIn,
            isAdmin: isAdmin,
            attributes: attributes,
            generalSettings: generalSettings,
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
