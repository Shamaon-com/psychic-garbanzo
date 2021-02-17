import LoadingAnimation from "../components/generalComponents/loadingAnimation";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../utils/functionsLib";
import { AmplifySignOut } from "@aws-amplify/ui-react";
import * as svg from '../utils/svg';
import { nav } from "@aws-amplify/ui";

export default function AdminLayout({ children, ...pageProps }) {
  const [isLoading, setIsLoading] = useState(true);
  const [enabledPages, setEnabledPages] = useState([]);
  const router = useRouter();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    console.log(authContext);
    onLoad();
  }, []);

  async function onLoad() {

    if (authContext.isAdmin && authContext.generalSettings.length === 0) {
      router.push("/control/settings");
    }
    else {
      checkEnabledPages();
      setIsLoading(false);
    }
  }

  const navigationData = {
    profile: {
      route: '/control/',
      image: svg.user(),
      text: 'Perfil'
    },
    questions: {
      route: '/control/questions',
      image: svg.preguntas(),
      text: 'Preguntas'
    },
    settings: {
      route: '/control/settings',
      image: svg.ajustes(),
      text: 'Configuracion'
    },
    users: {
      route: '/control/users',
      image: svg.users(),
      text: 'Usuarios'
    },


  }

  const checkEnabledPages = () => {
    if (authContext.isAdmin) {
      setEnabledPages(["settings", "users", "profile", "questions"]);
    } else if (authContext.attributes.groups.includes("ponentes")) {
      setEnabledPages(["profile", "questions"]);
    } else if (authContext.attributes.groups.includes("moderadoes")) {
      setEnabledPages(["profile", "questions"]);
    } else if (authContext.attributes.groups.includes("users")) {
      setEnabledPages(["profile"]);
    }
  }

  const renderNavigation = () => {

   return enabledPages.map((page) => {
      return (<li className="my-px">
        <a
          href={navigationData[page].route}
          className="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <span className="flex items-center justify-center text-lg text-gray-400">
            <span className="text-gray-600">
              {navigationData[page].image}
            </span>
          </span>
          <span className="ml-3">{navigationData[page].text}</span>
        </a>
      </li>
      )
    })
  }


  const renderAdminLayout = () => {
    return (
      <div className="min-h-screen h-screen flex flex-row bg-gray-100">
        <div className="flex w-full max-w-xs p-4 bg-white">
          <ul className="flex flex-col w-full">
            <li className="my-px">
              <a
                href="/"
                className="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 bg-gray-100"
              >
                <span className="flex items-center justify-center text-lg text-gray-400">
                  {svg.home()}
                </span>
                <span className="ml-3">Evento</span>
              </a>
            </li>
            <span  className="flex font-medium text-sm text-gray-400 px-4 my-4 uppercase">
                Control
            </span>
            {renderNavigation()}
            <li className="my-px mt-auto">
              <a
                href="#"
                className="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <span className="flex items-center justify-center text-lg text-red-400">
                  <svg
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                  </svg>
                </span>
                <AmplifySignOut />
              </a>
            </li>
          </ul>
        </div>
        <div className=" flex w-full justify-center py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    );
  };

  return <>{!isLoading ? renderAdminLayout() : <LoadingAnimation />}</>;
}
