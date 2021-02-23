import React from "react";
import LazyImage from './lazyImage';


export default function LoadingAnimation({ ...props }) {

    return (
      <div  className="min-h-screen h-screen">
        <div  className="w-full h-full flex justify-center items-center">
          <div  className="w-10 sm:w-44">
            <LazyImage s3Key={props.src} type="full" />
            <div  className="flex flex-row justify-center items-center max-h-2">
            <svg  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle  className="opacity-25" cx="12" cy="12" r="10" stroke="grey" strokeWidth="4"></circle>
                <path  className="opacity-75" fill="grey" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando
            </div>
          </div>
        </div>
      </div>
    );
}