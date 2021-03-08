import LoadingAnimation from "../components/generalComponents/loadingAnimation";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from 'next/router';
import { AuthContext } from "../utils/functionsLib";
import * as gtag from '../lib/gtag'
import { Storage } from "aws-amplify";

import LazyImage from '../components/generalComponents/lazyImage';



export default function GeneralLayout({ children }) {

  const [isLoading, setIsLoading] = useState(true);
  const [enabledPages, setEnabledPages] = useState([])
  const router = useRouter();
  const [isSmScreen, setIsSmScreen] = useState(false)
  const authContext = useContext(AuthContext);
  const [renderMobileNav, setRenderMobileNav] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("");
  const generalSettings = authContext.generalSettings[0];


  if (!authContext.isLoggedIn) {
    return (<></>)
  }


  useEffect(() => {
    console.log(authContext)
    onLoad();
    analytics();
  }, []);


  const analytics = () => {
    gtag.event({
      category: 'navigationData',
      action: router.pathname,
      value: new Date().toLocaleString(),
      label: authContext.attributes.sub
    })
  }


  async function onLoad() {
    if (authContext.isLoggedIn && authContext.generalSettings.length === 0) {
      console.log("pushing to settings");
      router.push("/control/settings");
    }
    else {
      checkEnabledPages();
      loadBackgroundImage();
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
    if (!isSmScreen) {
      enabledPages.push("pageControl");
    }
    setEnabledPages(enabledPages);
  }


  useEffect(() => {

    handleResizeSmScreen();
    // Add event listener
    window.addEventListener("resize", handleResizeSmScreen);
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResizeSmScreen);
  }, []);

  const handleResizeSmScreen = () => {
    if (document.body.clientWidth >= 1024) {
      setIsSmScreen(false)
      setRenderMobileNav(false)
    } else {
      setIsSmScreen(true)
    }
  }

  const renderNavModal = () => {
    return (
      <div className="bg-gray-100 shadow-sm absolute w-full text-center z-50">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a
            href="/"
            className="bg-gray-600 cursor-pointer text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Eventos
      </a>
          {enabledPages.map((page, index) => {
            return (
              <a
                key={index}
                href="#"
                className="text-blue-900  block px-3 py-2 rounded-md text-base font-small"
              >
                <a
                  href={"/" + page.match(/[A-Z][a-z]+/g)[0].toLowerCase()}
                  className="px-3 cursor-pointer py-2 rounded-md text-lg font-medium"
                  style={{ color: authContext.generalSettings[0].textColor }}
                >
                  {page.match(/[A-Z][a-z]+/g)[0]}
                </a>
              </a>
            )
          })}
        </div>
      </div>
    )
  }

  const renderPcSmScreen = () => {
    return (
      <div className="sticky top-0 h-20 border-b-4 z-50 border-gray-400"
        style={{ backgroundColor: authContext.generalSettings[0].backgroundColor }}>
        <div className="w-full h-full flex flex-col">
          <div className="py-3 h-full">
            <LazyImage s3Key={generalSettings.mainLogo} type="full" />
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded="false"
              onClick={(e) => setRenderMobileNav(!renderMobileNav)}
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
          { renderMobileNav && <div className="w-full h-full">{renderNavModal()}</div>}
        </div>
      </div>
    )
  }


  const renderPcNavBar = () => {
    return (
      <div className="sticky top-0 h-1/5 py-6 border-b-4 z-50 border-gray-400"
        style={{ backgroundColor: authContext.generalSettings[0].backgroundColor }}>
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-full">
          <div className="relative flex items-center justify-between h-full">
            <div className="flex-1 flex items-center h-full justify-center">
              <div className="flex-shrink-0 h-20 flex items-center">
                <LazyImage s3Key={generalSettings.mainLogo} type="full" />
              </div>
              <div className="hidden sm:block sm:ml-auto">
                <div className="flex space-x-4">
                  <a
                    href="/"
                    className="px-3 py-2  rounded-md text-lg font-medium"
                    style={{ color: authContext.generalSettings[0].textColor }}
                  >
                    Evento
              </a>
                  {enabledPages.map((page, index) => {
                    return (
                      <a
                        key={index}
                        href={"/" + page.match(/[A-Z][a-z]+/g)[0].toLowerCase()}
                        className="px-3 cursor-pointer py-2  rounded-md text-lg font-medium"
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

  const loadBackgroundImage = async () => {
    const data = await Storage.get(generalSettings.backgroundLoginImage, {
      level: 'public', // defaults to `public`
    })
    console.log(data)
    setBackgroundImage(data)
  }

  const renderLayout = () => {

    return (
      <div className="min-h-screen h-screen flex flex-col font-NanumGothic"
        style={{
          backgroundImage: "url(" + backgroundImage + ")",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          backgroundColor: generalSettings.backgroundColor,
          color: generalSettings.textColor
        }}
      >
        {isSmScreen ? renderPcSmScreen() : renderPcNavBar()}
        {children}
      </div>
    )
  }

  return <>{!isLoading ? renderLayout() : <LoadingAnimation src={''} />}</>;

}
