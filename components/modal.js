import React, { useState, useEffect, useRef } from "react";
import {capitalize} from '../utils/functionsLib';

export default function Modal({ ...props }) {
  /**
   * Recived props:
   * - field object
   * - setFields Hook
   * - Submit Function
   * 
   */

  const fileRef = useRef(null);


  const renderFileField = (field) => {
    return (
      <div class="mb-4">
        <label class="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
          File
        </label>
        <input
          id={field}
          accept="image/png, image/jpeg"
          ref={fileRef}
          type="file"
          onChange={props.handleFieldChange}
        />
      </div>
    );
  };

  const renderFields = () => {
    var dataArray = [];
    for (var field in props.fields) {
      if (field === "image") {
        dataArray.push(renderFileField(field));
      } else {
        dataArray.push(
          <div class="mb-4">
            <label class="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
              {capitalize(field)}
            </label>
            <input
              id={field}
              class="bg-gray-200 appearance-none border-2 border-gray-200  w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
              type="text"
              onChange={props.handleFieldChange}
            />
          </div>
        );
      }
    }

    return dataArray;
  };


  const renderModal = () => {
    return (
      <div
        style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        class="fixed z-40 top-0 right-0 left-0 bottom-0 h-full w-full"
      >
        <div class="p-4 max-w-xl mx-auto relative absolute left-0 right-0 overflow-hidden mt-24">
          <div
            onClick={(e) => {
              props.setShowModal(false);
            }}
            class="shadow absolute right-0 top-0 w-10 h-10 rounded-full bg-white text-gray-500 hover:text-gray-800 
                      inline-flex items-center justify-center cursor-pointer"
          >
            <svg
              class="fill-current w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M16.192 6.344L11.949 10.586 7.707 6.344 6.293 7.758 10.535 12 6.293 16.242 7.707 17.656 11.949 13.414 16.192 17.656 17.606 16.242 13.364 12 17.606 7.758z" />
            </svg>
          </div>

          <div class="shadow w-full  bg-white overflow-hidden w-full block p-8">
            <h2 class="font-bold text-2xl mb-6 text-gray-800 border-b pb-2">
              Añadir elemento
            </h2>
              {renderFields()}
            <div class="flex justify-end mt-8 text-right">
              <button
                type="button"
                class=" flex bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300  shadow-sm mr-2"
                onClick={(e) => {
                  props.setShowModal(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                class="inline-flex bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 border border-gray-700  shadow-sm"
                onClick={props.submit}
              >
                {props.isCreating &&
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                }
                Save Ponente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return <>{props.showModal ? renderModal() : <></>}</>;
}
