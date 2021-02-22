import LoadingAnimation from "../components/generalComponents/loadingAnimation";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from 'next/router';
import { AuthContext } from "../utils/functionsLib";
import { Analytics } from 'aws-amplify';

import LazyImage from '../components/generalComponents/lazyImage';
import { generateKeyPair } from "crypto";


export default function GeneralLayout({ children }) {

  const [isLoading, setIsLoading] = useState(true);
  const [enabledPages, setEnabledPages] = useState([])
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false)
  const authContext = useContext(AuthContext);
  const [renderMobileNav, setRenderMobileNav] = useState(false);

  const generalSettings = authContext.generalSettings[0];

  useEffect(() => {
    onLoad();
    recordEvent();
  }, []);

  const recordEvent = async () => {
    console.log(children.type.name)

    try {
      Analytics.record({
        data: {
          event: "page load",
          date: new Date(),
          triggerFrom: "generalLayout",
          destination: children.type.name
        },
        streamName: 'analytics-dev'
      }, 'AWSKinesisFirehose');
    } catch (e) {
      console.log(e);
    };
  }


  async function onLoad() {
    if (authContext.isLoggedIn && authContext.generalSettings.length === 0) {
      console.log("pushing to settings")
      router.push("/control/settings");
    }
    else {
      checkEnabledPages();
      setIsLoading(false);
    }
  }


  const checkEnabledPages = () => {
    const pageArray = ["pageAgenda", "pageContacto", "pagePonentes", "pagePatrocinadores", "pageRecursos"]
    const generalSettings = authContext.generalSettings[0]

    var enabledPages = []

    for (let i = 0; i < pageArray.length; i++) {
      if (generalSettings[pageArray[i]]) {
        enabledPages.push(pageArray[i])
      }
    }

    if(!isMobile){
      enabledPages.push("pageControl");
    }

    setEnabledPages(enabledPages);
  }


  useEffect(() => {
    handleResize();
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleResize = () => {

    if (window.screen.width >= 1024) {
      setIsMobile(false)
    } else {
      setIsMobile(true)
    }
  }

  const renderNavModal = () => {
    return (
      <div className="bg-gray-100 absolute w-full text-center">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a
            href="#"
            className="bg-gray-600 cursor-pointer text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Eventos
      </a>
          {enabledPages.map((page) => {
            return (
              <a
                href="#"
                className="text-blue-900  block px-3 py-2 rounded-md text-base font-small"
              >
                <a
                  href={"/" + page.match(/[A-Z][a-z]+/g)[0].toLowerCase()}
                  className="px-3 cursor-pointer py-2 font-bold rounded-md text-lg font-medium"
                  style={{ color: authContext.generalSettings[0].textColor }}
                >
                  {page.match(/[A-Z][a-z]+/g)[0]}
                </a>
              </a>
            )
          })}
          <a
            onClick={() => setRenderMobileNav(false)}
            className="px-3 py-2 cursor-pointer font-bold rounded-md text-lg font-small"
          >
            Cerrar
      </a>
        </div>
      </div>
    )
  }

  const renderMobileMenu = () => {
    return (
      <div className="h-16 border-b-4 border-t-4 border-gray-400">
        <div className="relative flex justify-between h-full">
          <div className="flex-1 flex  h-full">
            <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
              <button
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-expanded="false"
                onClick={(e) => setRenderMobileNav(true)}
              >
                <span className="sr-only">Open main menu</span>

                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>

                <svg
                  className="hidden h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="h-16 ">
            <LazyImage s3Key={generalSettings.mainLogo} type="full" />
              <img
                className="object-contain h-full py-2"
                src="/img/Screen Capture_select-area_20201221163707.png"
                alt="Workflow"
              />
            </div>
          </div>
          {renderMobileNav && renderNavModal()}
        </div>
      </div>
    )
  }

  const renderPcNavBar = () => {
    return (
      <div className="h-1/5 py-6 border-b-4 border-gray-400">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-full">
          <div className="relative flex items-center justify-between h-full">
            <div className="flex-1 flex items-center h-full justify-center">
              <div className="flex-shrink-0 flex items-center h-full ">
              <LazyImage s3Key={generalSettings.mainLogo} type="full" />

              </div>
              <div className="hidden sm:block sm:ml-auto">
                <div className="flex space-x-4">
                  <a
                    href="/"
                    className="px-3 py-2 font-bold rounded-md text-lg font-medium"
                    style={{ color: authContext.generalSettings[0].textColor }}
                  >
                    Evento
              </a>
                  {enabledPages.map((page, index) => {
                    return (
                      <a
                        href={"/" + page.match(/[A-Z][a-z]+/g)[0].toLowerCase()}
                        className="px-3 cursor-pointer py-2 font-bold rounded-md text-lg font-medium"
                        style={{ color: authContext.generalSettings[0].textColor }}
                      >
                        {page.match(/[A-Z][a-z]+/g)[0]}
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }


  const renderLayout = () => {

    return (
      <div className="min-h-screen h-screen flex flex-col font-NanumGothic"
        style={{ backgroundColor: generalSettings.backgroundColor, color: generalSettings.textColor }}
      >
        {isMobile ? renderMobileMenu() : renderPcNavBar()}
        {children}
      </div>
    )
  }

  return <>{!isLoading ? renderLayout() : <LoadingAnimation src={generalSettings.mainLogo}/>}</>;

}
