import { AuthContext } from "../utils/functionsLib";
import GeneralLayout from "../layouts/generalLayout";
import Chat from "../components/chat";
import Iframe from "../components/iframe";

import React, { useState, useEffect, useContext, useRef} from "react";


export default function Home(props) {

  const authContext = useContext(AuthContext);
  const [display, setDisplay] = useState(true);

  useEffect(() => {

  }, []);

  
  return (
    <GeneralLayout>
      <div className="h-5/6 lg:h-4/5 flex lg:py-12 lg:px-8">
        <div className="container flex flex-col lg:flex-row mx-auto h-full">
          <div class="w-full lg:px-5 lg:justify-center lg:items-center lg:h-full lg:w-3/4">
            <Iframe />
          </div>
          {display && (
            <div class="flex-1 lg:h-full lg:w-1/4">
              <Chat />
            </div>
          )}
        </div>
      </div>
    </GeneralLayout>
  );
}
