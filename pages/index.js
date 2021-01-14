import { AuthContext } from "../utils/functionsLib";
import GeneralLayout from "../layouts/generalLayout";
import Chat from "../components/chat";
import Iframe from "../components/iframe";
import {ContainerPageRow} from "../layouts/components/containerPage"
import React, { useState, useEffect, useContext, useRef} from "react";


export default function Home(props) {

  const authContext = useContext(AuthContext);


  useEffect(() => {

  }, []);

  
  return (
    <GeneralLayout>
      <div className="flex flex-col lg:flex-row h-full">
        <div class=" h-2/3 lg:h-full lg:w-3/4">
          <Iframe />
        </div>
        <div class=" h-1/3 lg:h-full lg:w-1/4">
          <Chat />
        </div>
      </div>
    </GeneralLayout>
  );
}
