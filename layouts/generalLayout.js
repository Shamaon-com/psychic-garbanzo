import { Auth, API } from "aws-amplify";
import LoadingAnimation from "../components/loadingAnimation";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';

export default function GeneralLayout({ children, ...pageProps }) {

  const [isLoading, setIsLoading] = useState(true);
  const login = true;
  const router = useRouter();

  useEffect(() => {
    onLoad();

  }, []);

  async function onLoad() {

    if (
      login && pageProps.authContext.isLoggedIn == false 
    ) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }



  const renderLayout = () => {
    return (
    <div class="min-h-screen h-screen flex flex-col font-mono">
      <div class="h-1/5 py-6 border-b-4 border-gray-400">
        <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-full">
          <div class="relative flex items-center justify-between h-full">
            <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                class="inline-flex items-center justify-center p-2 rounded-md text-gray-400  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-expanded="false"
              >
                <span class="sr-only">Open main menu</span>

                <svg
                  class="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>

                <svg
                  class="hidden h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div class="flex-1 flex items-center h-full">
              <div class="flex-shrink-0 flex items-center h-full  ">
                <img
                  class="block lg:hidden h-8 w-auto"
                  src="https://tailwindui.com/img/logos/workflow-mark-blue-500.svg"
                  alt="Workflow"
                />
                <img
                  class="object-contain w-full h-full"
                  src="/img/Screen Capture_select-area_20201221163707.png"
                  alt="Workflow"
                />
              </div>
              <div class="hidden sm:block sm:ml-auto">
                <div class="flex space-x-4">
                  <a
                    href="/"
                    class="text-blue-900  px-3 py-2 font-bold rounded-md text-lg font-medium"
                  >
                    Evento
                  </a>
                  <a
                    href="/agenda"
                    class="text-blue-900  px-3 py-2 font-bold rounded-md text-lg font-medium"
                  >
                    Agenda
                  </a>
                  <a
                    href="/ponentes"
                    class="text-blue-900  px-3 py-2 font-bold rounded-md text-lg font-medium"
                  >
                    Ponentes
                  </a>
                  <a
                    href="/patrocinadores"
                    class="text-blue-900  px-3 py-2 font-bold rounded-md text-lg font-medium"
                  >
                    Patrocinadores
                  </a>
                  <a
                    href="/prensa"
                    class="text-blue-900  px-3 py-2 font-bold rounded-md text-lg font-medium"
                  >
                    Prensa
                  </a>
                  <a
                    href="/contacto"
                    class="text-blue-900  px-3 py-2 font-bold rounded-md text-lg font-medium"
                  >
                    Contacto
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="hidden sm:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <a
              href="#"
              class="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Dashboard
            </a>
            <a
              href="#"
              class="text-blue-900  block px-3 py-2 rounded-md text-base font-medium"
            >
              Team
            </a>
            <a
              href="#"
              class="text-blue-900  block px-3 py-2 rounded-md text-base font-medium"
            >
              Projects
            </a>
            <a
              href="#"
              class="text-blue-900  block px-3 py-2 rounded-md text-base font-medium"
            >
              Calendar
            </a>
          </div>
        </div>
      </div>

      <div class="flex w-full h-4/5 p-4 bg-white">
        <ul class="flex w-full">
          {children}
      </ul>
      </div>
    </div>
    )
  }

  return <>{!isLoading ? renderLayout() : <LoadingAnimation />}</>;

}
