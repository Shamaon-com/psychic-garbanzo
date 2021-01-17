import React, { useState, useEffect, useRef } from "react";
import { capitalize } from '../utils/functionsLib';
import { useFormFields } from '../utils/hooksLib'


export default function Modal({ ...props }) {
  /**
   * Recived props:
   * - field object
   * - setFields Hook
   * - Submit Function
   * 
   */

  const fileRef = useRef(null);


  const renderTextField = (fieldName, field) => {
    return (
      <div className="mb-4">
        <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
          {capitalize(fieldName)}
        </label>
        <input
          id={fieldName}
          className="bg-gray-200 appearance-none border-2 border-gray-200  
          w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none 
          focus:bg-white focus:border-blue-500"
          type="text"
          onChange={props.handleFieldChange}
        />
      </div>
    )
  };


  const renderFileField = (fieldName, field) => {
    return (
      <div className="mb-4">
        <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
          {capitalize(fieldName)}
        </label>
        <input
          id={fieldName}
          accept="*"
          ref={fileRef}
          type="file"
          onChange={props.handleFieldChange}
        />
      </div>
    );
  };

  const renderSelectField = (fieldName, field) => {
    return (
      <div className="mb-4">
        <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
          {fieldName}
        </label>
        <select
              id={fieldName}
              className="mt-1 w-1/2 self-center block py-2 px-3 border border-gray-300 
                    bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 
                    focus:border-indigo-500 sm:text-sm"
              onChange={props.handleFieldChange}
            >
              {field.options.map((item) => {
                return <option value={item.key}>{item.text}</option>;
              })}
            </select>
      </div>
    );
  };


  const handleDatetimeInput = (e) => {
    var toInt = Number(e.target.value);

    switch (e.target.id.split("_")[1]){
      case "day":
        if (toInt !== NaN && toInt < 32 && toInt > -1) {
          props.handleFieldChange(e)
        }
        break;
      case "hour":
        if (toInt !== NaN && toInt < 24 && toInt > -1) {
          props.handleFieldChange(e)
        }
        break;
      case "minute":
        console.log("case minute")
        if (toInt !== NaN && toInt < 60 && toInt > -1) {
          props.handleFieldChange(e);
        }
        break;
      default:
        console.log("error");
    }
  };


  const renderDateField = (fieldName, field) => {
    const MONTH_NAMES = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    return (

      <div className="mb-4">
        <label className="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
          {capitalize(fieldName)}
        </label>
        <div className="flex flex-row space-x-2">
          <div className="flex flex-col justify-center">
            <label className="text-gray-700 block mb-1 font-bold text-xs text-center ">
              {"Dia"}
            </label>
            <input
              id={fieldName + "_day"}
              value={props.fields[fieldName].value.day}
              className="w-12 bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg
               text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
              type="text"
              onChange={(e) => {
                handleDatetimeInput(e);
              }}
            />
          </div>
          <div className="flex flex-col justify-center">
            <label className="text-gray-700 block mb-1 font-bold text-xs text-center ">
              {"Mes"}
            </label>
            <select
              id={fieldName + "_month"}
              value={props.fields[fieldName].value.month}
              className="mt-1 self-center block py-2 px-3 border border-gray-300 bg-white rounded-md 
               shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
               onChange={props.handleFieldChange}
            >
              {MONTH_NAMES.map((month, key) => {
                return <option value={key}>{month}</option>;
              })}
            </select>
          </div>
          <div className="flex flex-col justify-center">
            <label className="text-gray-700 block mb-1 font-bold text-xs text-center ">
              {"Hora"}
            </label>
            <input
              id={fieldName + "_hour"}
              value={props.fields[fieldName].value.hour}
              className="mr-auto w-12 bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg
               text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
              type="text"
              onChange={(e) => {
                handleDatetimeInput(e);
              }}
            />
          </div>
          <div className="flex flex-col justify-center">
            <label className="text-gray-700 block mb-1 font-bold text-xs text-center ">
              {"Minuto"}
            </label>
            <input
              id={fieldName + "_minute"}
              value={props.fields[fieldName].value.minute}
              className="w-12 bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg
               text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
              type="text"
              onChange={(e) => {
                handleDatetimeInput(e);
              }}
            />
          </div>
        </div>
      </div>
    );

  }


  const renderFields = () => {
    var dataArray = [];
    
    for (var field in props.fields) {
      switch (props.fields[field].type) {
        case "select":
          dataArray.push(renderSelectField(field, props.fields[field]));
          break;
        case "file":
          dataArray.push(renderFileField(field, props.fields[field]));
          break;
        case "date":
          dataArray.push(renderDateField(field, props.fields[field]));
          break;
        default:
          dataArray.push(renderTextField(field, props.fields[field]));
      }
    }
    return dataArray;

  };

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
            {renderFields()}
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
