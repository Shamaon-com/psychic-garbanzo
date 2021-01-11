import { AuthContext } from "../utils/functionsLib";
import GeneralLayout from "../layouts/generalLayout";
import Chat from "../components/chat";
import Iframe from "../components/iframe";

import React, { useState, useEffect, useContext, useRef} from "react";


export default function Home(props) {

  const authContext = useContext(AuthContext);


  useEffect(() => {

  }, []);

  
  return (
    <GeneralLayout authContext={authContext}>
      <div class="flex flex-row max-w-screen-2xl mx-auto w-full">
        <div class="w-3/4">
          <Iframe authContext={authContext} />
        </div>
        <div class="w-1/4">
          <Chat authContext={authContext} />
        </div>
      </div>
    </GeneralLayout>
  );
}
