import "tailwindcss/tailwind.css";
import { Amplify, Auth, API, graphqlOperation } from "aws-amplify";
import awsconfig from "../src/aws-exports";
import { useRouter } from 'next/router';

import React, { useState, useEffect } from "react";
import LoadingAnimation from "../components/generalComponents/loadingAnimation";

import { AuthContext } from "../utils/functionsLib";

import * as queries from "../src/graphql/queries";

Amplify.configure(awsconfig);


function MyApp({ Component, pageProps}) {


  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [attributes, setAttributes] = useState({});
  const [generalSettings, setGeneralSettings] = useState([]);

  const router = useRouter();

  const Layout = Component.layout || (({children}) => <>{children}</>)
  
  useEffect(() => {

    async function onLoad() {
      try {
        // load user data
        const userData = await Auth.currentUserInfo();
        setAttributes(userData.attributes);
        
        // load user session
        const session = await Auth.currentSession();
        setIsAdmin((session).accessToken.payload['cognito:groups'].includes("admins"));
        
        // load settings data
        const settings = await API.graphql(graphqlOperation(queries.listGeneralSettingss));
        setGeneralSettings(settings.data.listGeneralSettingss.items);

        setIsLoggedIn(true);
        setIsAuthenticating(false);

      } catch (e) {
        console.log(e);
        setIsAuthenticating(false);
      }
    }
    onLoad();
  }, []);



  const login = async (username, password) => {
    try {
      // Sign in user
      const user = await Auth.signIn(username, password);

      if (user.challengeName) {
        router.push('/verify');
      } else {
        setIsAdmin(user.signInUserSession.accessToken.payload['cognito:groups'].includes("admins"))
        setAttributes(user.attributes);
      }
    } catch (e) {
      console.log(e)
    }

  }

  const logout = () => {
    setIsLoggedIn(false);
  };


  return (
    <>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic&display=swap" rel="stylesheet" />
      </head>
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
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthContext.Provider>
      ) : (
          <LoadingAnimation />
        )}
    </>
  );
}

export default MyApp;
