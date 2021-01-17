import React, { useState, useEffect, useContext, useRef } from "react";
import { API, graphqlOperation } from "aws-amplify";
import * as mutations from "../config/graphql/mutations";
import * as queries from "../config/graphql/queries";
import * as subscriptions from "../config/graphql/subscriptions";
import { AuthContext } from "../utils/functionsLib";


export default function Iframe({ ...props }) {
  

  const [src, setSrc] = useState("");
  const [title, setTitle] = useState("");
  const [iframe, setIframe] = useState(null);
  const parentRef = useRef(null);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);


  const authContext = useContext(AuthContext);

  useEffect(() => {
    onPageRendered();

  }, []);

  useEffect(() => {
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    handleResize();
  });
 
  const solveResize = (parentWidth, parentHeight) => {

    if(1.69 < parentWidth/parentHeight >  1.72){
      return [parentWidth, parentHeight];
    }
    else if(parentWidth > parentHeight){
      while(parentWidth < parentHeight*1.7){
        parentHeight--;
      }
    }
    else if(parentHeight > parentWidth){
      parentHeight = parentWidth / 1.7
    }
    
    return [parentWidth, parentWidth/1.7];
  }

  const handleResize = () => {

    if(parentRef.current){
      const parentWidth = parentRef.current.offsetWidth;
      const parentHeight = parentRef.current.offsetHeight;
      const [width, height] = solveResize(parentWidth, parentHeight);
      setWidth(width); setHeight(height);
      }
  };

  const onPageRendered = async () => {
    getIframe();
    subscribeCreateIframe();
  };

  /**
   * CRUD Operation functions
   */

  const getIframe = () => {
    API.graphql(graphqlOperation(queries.listIframes)).then((data) => {
      setIframe(data.data.listIframes.items[0]);
    });
  };

  const deleteIframe = (id) => {
    var itemDetails = {
      id: id,
    };
    API.graphql(
      graphqlOperation(mutations.deleteIframe, { input: itemDetails })
    );
    setIframe(null);
  };

  const subscribeCreateIframe = async () => {
    await API.graphql(graphqlOperation(subscriptions.onCreateIframe)).subscribe(
      {
        next: (subonCreateEvent) => {
          setIframe(subonCreateEvent.value.data.onCreateIframe);
        },
      }
    );
  };

  const createIframe = (e) => {
    if (title === "" || src === "") {
      alert("Mensaje vacio");
      return;
    }

    var itemDetails = {
      url: src,
      title: title,
    };

    console.log("Event Details : " + JSON.stringify(itemDetails));
    API.graphql(
      graphqlOperation(mutations.createIframe, { input: itemDetails })
    );
  };

  const renderIframe = () => {
    
    return (
      <>
        {iframe && (
            <div
              ref={parentRef}
              style={{width: "100%"}}
              class="justify-center items-center relative"
            >
              {authContext.isAdmin && (
                <div
                  id={iframe.id}
                  class="bg-red-500 text-white text-center cursor-pointer z-50 absolute top-0 right-0 "
                  style={{ width: "50px" }}
                  onClick={(e) => {
                    deleteIframe(e.target.id);
                  }}
                >
                  -
                </div>
              )}
              <iframe
                class="z-10"
                src={iframe.url}
                scrolling="no"
                frameborder="1"
                marginheight="0px"
                marginwidth="0px"
                height={height}
                width={width}
                allowfullscreen
              />
            </div>
        )}
      </>
    );
  };


  const renderCreate = () => {
    return (
      <div class="flex flex-col w-full ">
      <h2 class="py-4">Titulo de la emision</h2>
      <input
        value={title}
        class="bg-gray-200 appearance-none border-2 border-gray-200 w-3/4 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
        type="text"
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <h2 class="py-4">Intrduzca Iframe URL</h2>
      <div class="flex flex-row">
        <input
          value={src}
          class="bg-gray-200 appearance-none border-2 border-gray-200 w-3/4 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
          type="text"
          onChange={(e) => {
            setSrc(e.target.value);
          }}
        />
        <div class="w-10 h-10 mx-4">
          <svg
            onClick={(e) => {
              createIframe();
            }}
            class="cursor-pointer"
            id="Capa_1"
            enable-background="new 0 0 280.823 280.823"
            viewBox="0 0 280.823 280.823"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m120.353 120.353h-20.059v40.118h-40.118v20.059h40.118v40.118h20.059v-40.118h40.118v-20.059h-40.118z" />
            <path d="m250.735 0h-160.47c-16.592 0-30.089 13.497-30.089 30.088v30.088h-30.088c-16.591 0-30.088 13.497-30.088 30.089v160.471c0 16.592 13.497 30.088 30.088 30.088h160.471c16.592 0 30.088-13.497 30.088-30.088v-30.088h30.088c16.592 0 30.088-13.497 30.088-30.088v-160.472c0-16.591-13.496-30.088-30.088-30.088zm-50.147 250.735c0 5.534-4.496 10.029-10.029 10.029h-160.471c-5.534 0-10.029-4.496-10.029-10.029v-160.47c0-5.534 4.496-10.029 10.029-10.029h160.471c5.534 0 10.029 4.496 10.029 10.029zm60.177-60.176c0 5.534-4.496 10.029-10.029 10.029h-30.088v-110.323c0-16.592-13.497-30.088-30.088-30.088h-110.325v-30.089c0-5.534 4.496-10.029 10.029-10.029h160.471c5.534 0 10.029 4.496 10.029 10.029v160.471z" />
          </svg>
        </div>
      </div>
    </div>
    )
  }
  return (
    <div class="flex w-full h-full items-center">
      {renderIframe()}
      {authContext.isAdmin && !iframe && 
        renderCreate()
      }
    </div>
  );
}
