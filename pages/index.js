import { AuthContext } from "../utils/functionsLib";
import { useRouter } from 'next/router';
import GeneralLayout from "../components/generalLayout";
import Chat from "../components/chat";
import Iframe from "../components/iframeGenerator";

import React, { useState, useEffect, useContext, useRef} from "react";


export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const authContext = useContext(AuthContext);
  const router = useRouter();

  
  useEffect(() => {
    if(!authContext.isLoggedIn){
      console.log("not logged in");
      router.push('/login')
    }
    else{
      console.log(authContext.userData.attributes.email);
      setUser(authContext.userData.attributes.email);
    }
    setIsLoading(false);

  }, []);



  
  return (
    <>
    {
      isLoading ? (
        <div>
          Loading
        </div>
      ) : (
        <GeneralLayout>
          <div class="flex flex-row max-w-screen-2xl mx-auto w-full">
            <div  class="w-3/4">
              <Iframe/>
            </div>
            <div class="w-1/4">
              <Chat user={user}/>
            </div>
          </div>
        </GeneralLayout>
      )
    }
    </>
  )
}
