import React, { useEffect, useRef, useState } from "react";
import { capitalize } from '../utils/functionsLib';
import Iframe from "../components/iframe";



export default function IframeModal({ ...props }) {
  /**
   * Recived props:
   * 
   * Iframe Src 
   * 
   */

    const [src, setSrc] = useState(null);

    useEffect(() => {
        setSrc(props.iframeSrc);

    }, [props.iframeSrc]);

  const renderModal = () => {
    return (
      <div
        style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        className="fixed z-40 top-0 right-0 left-0 bottom-0 h-full w-full"
      >
        <div className="p-4 max-w-xl mx-auto relative absolute left-0 right-0 overflow-hidden mt-24">
          <div
            onClick={(e) => {
              props.setShowModal(false);
            }}
            className="shadow absolute right-0 top-0 w-10 h-10 rounded-full bg-white text-gray-500 hover:text-gray-800 
                      inline-flex items-center justify-center cursor-pointer"
          >
            <svg
              className="fill-current w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M16.192 6.344L11.949 10.586 7.707 6.344 6.293 7.758 10.535 12 6.293 16.242 7.707 17.656 11.949 13.414 16.192 17.656 17.606 16.242 13.364 12 17.606 7.758z" />
            </svg>
          </div>

          <div className="shadow w-full  bg-white overflow-hidden w-full block p-8">
            <h2 className="font-bold text-2xl mb-6 text-gray-800 border-b pb-2">
              Añadir {props.element}
            </h2>
            { iframeSrc && <Iframe src={src} id={0} deleteIframe={null} /> }
            <div className="flex justify-end mt-8 text-right">
              <button
                type="button"
                className=" flex bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300  shadow-sm mr-2"
                onClick={(e) => {
                  props.setShowModal(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 border border-gray-700  shadow-sm"
                onClick={props.submit}
              >
                {props.isCreating &&
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                }
                Save {props.element}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return <>{props.showModal ? renderModal() : <></>}</>;
}
