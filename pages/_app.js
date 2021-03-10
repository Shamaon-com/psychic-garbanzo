import "tailwindcss/tailwind.css";
import { Amplify, Auth, API, graphqlOperation, button } from "aws-amplify";
import awsconfig from "../src/aws-exports";
import { useRouter } from 'next/router';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignIn } from '@aws-amplify/ui-react';
import { AuthState} from "@aws-amplify/ui-components";
import React, { useState, useEffect } from "react";
import LoadingAnimation from "../components/generalComponents/loadingAnimation";
import * as gtag from '../lib/gtag'
import { AuthContext } from "../utils/functionsLib";
import { I18n } from 'aws-amplify';
import * as queries from "../src/graphql/queries";



Amplify.configure(awsconfig);




function MyApp({ Component, pageProps }) {


  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [attributes, setAttributes] = useState({});
  const [generalSettings, setGeneralSettings] = useState([]);

  const router = useRouter();

  const Layout = Component.layout || (({ children }) => <>{children}</>)

  const dict = {
    'es': {
        'Login':"Acceder",
        'Have an account?':"¿Ya está registrado?",
        'Login':"Acceder",
        'Email Address *':"Correo electrónico  *",
        'Email *':"Correo electrónico *",
        'CREATE ACCOUNT':"Registrarse",
        'Enter your email address':"Introduzca su correo electrónico",
        'Password *':"Contraseña *",
        'Enter your password':"Introduzca su contraseña",
        'Forgot your password?':"¿Se te ha olvidado la contraseña?",
        'Reset password':"Restablecer contraseña",
        'No account?':"¿No estas registrado?",
        'Create account':"Crear una cuenta",
        'Sign In': "Acceder",
        'Sign in': "Acceder",
        'Sign Up': "Regístrate"
    }
};

I18n.putVocabularies(dict)
  
  useEffect(() => {

    loadSettings();
    onLoad();
  }, []);

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  const handleAuthStateChange = (nextAuthState, authData) => {
    setIsAuthenticating(true); setIsLoadingSettings(true);
    if (nextAuthState === AuthState.SignedIn) {
      //console.log("user successfully signed in!");
      //console.log("user data: ", authData);

      onLoad(); loadSettings();
    }
    if (authData) {
      //console.log("authData: ", authData);
    }
  };


  async function onLoad() {
    //console.log("is loading user data")
    try {
      // load user data
      const userData = await Auth.currentUserInfo();
      // load user session
      const session = await Auth.currentSession();
      setIsAdmin((session).accessToken.payload['cognito:groups'].includes("admins"));
      setAttributes({ ...userData.attributes, 'groups': session.accessToken.payload['cognito:groups'] })

      setIsLoggedIn(true);
      setIsAuthenticating(false);

    } catch (e) {
      console.log(e);
      setIsAuthenticating(false);
    }
  }

  async function loadSettings() {
    //console.log("is loading settings")

    // load settings data
    try {
      const settings = await API.graphql(graphqlOperation(queries.listGeneralSettingss));
      setGeneralSettings(settings.data.listGeneralSettingss.items);
      setIsLoadingSettings(false);
    } catch (e) {
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


  const MyTheme = {
    Formcontainer: { 'backgroundColor': 'red', 'borderColor': 'red' }

}

/*

      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic&display=swap" rel="stylesheet" />
      </head>

    */
  return (
    <AmplifyAuthenticator handleAuthStateChange={handleAuthStateChange}theme={MyTheme} hideDefault={true} >
      <AmplifySignUp
        slot="sign-up"
        headerText="Crea una nueva cuenta"
        usernameAlias="email"
        formFields={[
          {
            type: "email",
            label: "Email *",
            placeholder: "Introduzca su dirección de correo electrónico",
            required: true,
          },
          {
            type: "password",
            label: "Contraseña *",
            placeholder: "Introduzca su contrasena",
            required: true,
          }
        ]}
        submitButtonText="Registrarse"

      />
      <AmplifySignIn headerText="Login" slot="sign-in" usernameAlias="email"/>
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
