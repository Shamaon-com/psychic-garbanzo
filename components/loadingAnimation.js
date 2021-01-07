import React from "react";



export default function LoadingAnimation({ ...props }) {

    return (
      <div class="min-h-screen h-screen">
        <div class="w-full h-full flex justify-center items-center">
          <div class="w-50 h-50">
            <img
              class="object-contain w-50 h-50"
              src="/img/Screen Capture_select-area_20201221163707.png"
              alt="Workflow"
            />
            <div class="flex flex-row justify-center items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="grey" stroke-width="4"></circle>
                <path class="opacity-75" fill="grey" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando
            </div>
          </div>
        </div>
      </div>
    );
}