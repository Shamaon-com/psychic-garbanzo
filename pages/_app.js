import "tailwindcss/tailwind.css";
import { Amplify, Auth, API, graphqlOperation, AWSKinesisFirehoseProvider, Analytics} from "aws-amplify";
import awsconfig from "../src/aws-exports";
import { useRouter } from 'next/router';
import { AmplifyAuthenticator } from "@aws-amplify/ui-react";
import React, { useState, useEffect } from "react";
import LoadingAnimation from "../components/generalComponents/loadingAnimation";

import { AuthContext } from "../utils/functionsLib";

import * as queries from "../src/graphql/queries";

Amplify.configure(awsconfig);

Analytics.addPluggable(new AWSKinesisFirehoseProvider());


Analytics.configure({
  AWSKinesisFirehose: {
      region: 'eu-west-1',
      bufferSize: 1000,
      flushSize: 100,
      flushInterval: 5000, // 5s
      resendLimit: 5
  } 
});

function MyApp({ Component, pageProps }) {


  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [attributes, setAttributes] = useState({});
  const [generalSettings, setGeneralSettings] = useState([]);

  const router = useRouter();

  const Layout = Component.layout || (({ children }) => <>{children}</>)

  useEffect(() => {

    async function onLoad() {
      try {
        // load user data
        const userData = await Auth.currentUserInfo();

        // load user session
        const session = await Auth.currentSession();
        setIsAdmin((session).accessToken.payload['cognito:groups'].includes("admins"));
        setAttributes({...userData.attributes, 'groups': session.accessToken.payload['cognito:groups']})

        setIsLoggedIn(true);
        setIsAuthenticating(false);

      } catch (e) {
        console.log(e);
        setIsAuthenticating(false);
      }
    }

    async function loadSettings(){
      // load settings data
      try{
        const settings = await API.graphql(graphqlOperation(queries.listGeneralSettingss));
        setGeneralSettings(settings.data.listGeneralSettingss.items);
        setIsLoadingSettings(false);
      } catch(e){
        console.log(e);
        const settings = await API.graphql({
          query: queries.listGeneralSettingss,
          variables: {},
          authMode: "AWS_IAM"
        });
        setGeneralSettings(settings.data.listGeneralSettingss.items);
        setIsLoadingSettings(false);
      }
    }
    loadSettings();
    onLoad();
  }, []);

  return (
    <AmplifyAuthenticator>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic&display=swap" rel="stylesheet" />
      </head>
      {!isAuthenticating && !isLoadingSettings ? (
        <AuthContext.Provider
          value={{
            isLoggedIn: isLoggedIn,
            isAdmin: isAdmin,
            attributes: attributes,
            generalSettings: generalSettings
          }}
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthContext.Provider>
      ) : (
        <LoadingAnimation />
      )}
    </AmplifyAuthenticator>
  );
}

export default MyApp;
