import AdminLayout from "../../layouts/adminLayout";
import ContainerPage from "../../components/containers/containerPage";
import React, { useContext, useEffect, useRef, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";

import { setDictValue } from "../../utils/hooksLib";
import { AuthContext, uploadToS3 } from "../../utils/functionsLib";
import { ChromePicker } from "react-color";
import useDynamicRefs from "use-dynamic-refs";

import * as mutations from "../../src/graphql/mutations";

export default function PlatformControl(props) {
  const authContext = useContext(AuthContext);
  const [disabled, setDisabled] = useState(true);
  const [appID, setAppId] = useState(null);
  const [getRef, setRef] = useDynamicRefs();
  const [tab, setTab] = useState(0);
  const [loaded, setIsLoaded] = useState(false)
  const [initalState, setInitalState] = useState({
    login: "con-registro",
    mainLogo: null,
    backgroundLoginImage: null,
    backgroundColor: "#ffffff",
    boxBackgroundColor: "#eff6ff",
    boxBorderColor: "#9ca3af",
    boxInnerTextColor: "#1d4fd8",
    boxTitleColor: "#ffffff",
    titleColor: "#6b7280",
    textColor: "#1e3a8a",
    pageAgenda: false,
    pagePonentes: false,
    pagePatrocinadores: false,
    pagePrensa: false,
    pageContacto: false,
  })

  const [dict, setDict] = setDictValue(initalState);

  useEffect(() => {

    /**
     * Assing incoming settings object to inital state,
     * respecting intial state keys without adding more keys.
     * https://stackoverflow.com/questions/40573555/merge-two-objects-but-only-existing-properties
     */

    if (authContext.generalSettings[0] !== undefined) {
      setAppId(authContext.generalSettings[0]["id"]);
      let obj1 = initalState;
      
      Object.keys(authContext.generalSettings[0]).forEach(function (key) {
        if (key in obj1) {
          obj1[key] = authContext.generalSettings[0][key];
        }
      });

      setInitalState(obj1);
    }

    setIsLoaded(true);
  }, []);

  const setValue = () => {
    /**
     * If id is empty we create new settings, but we need
     * to check that all fields are populated
     * else we just update the settings with the new values
     */
    if (appID === null && dict.login !== "") {
      createSettings();
    } else if (dict.login !== "") {
      updateSettings();
    } else {
      alert("Settings cant be empty");
    }
  };


  const createSettings = () => {

    setIsLoaded(false);

    API.graphql(
      graphqlOperation(mutations.createGeneralSettings, { input: dict })
    );

    setIsLoaded(true);
    setDisabled(true);
  };

  const updateSettings = () => {

    setIsLoaded(false);
    const dictAndId = { ...dict, id: appID };

    if (dict["mainLogo"] !== null) {
      dictAndId["mainLogo"] = dict["mainLogo"].value.name;
      uploadToS3(dict["mainLogo"].value);
    }

    if (dict["backgroundLoginImage"] !== null) {
      dictAndId["backgroundLoginImage"] = dict["backgroundLoginImage"].value.name;
      uploadToS3(dict["backgroundLoginImage"].value);
    }

    API.graphql(
      graphqlOperation(mutations.updateGeneralSettings, { input: dictAndId })
    );
    setIsLoaded(true);
    setDisabled(true);
  };

  const deleteSettings= () => {

    if(window.confirm('Are you sure you wish to delete this item?')){
      console.log(appID)
      API.graphql(
        graphqlOperation(mutations.deleteGeneralSettings, { input: {id: appID} })
      );
    }
  };

  const validate = () => {
    // check if all items in dict are populated
    for (let key in dict) {
      if (dict[key] === "") {
        setDisabled(true);
        return false;
      }
    }
    setDisabled(false);
    return true;
  };

  const renderColorPicker = (refId) => {
    return (
      <div  className="absolute">
        <div
           className="relative"
          ref={setRef(refId)}
          style={{ display: "none" }}
        >
          <div  className="flex flex-row">
            <div  className="flex w-4/5">
              <ChromePicker
                color={dict[refId]}
                onChange={(color) => {validate(); setDict(refId, color.hex)}}
              />
            </div>
            <div
               className="flex w-1/5 justify-center bg-white h-8 shadow-lg font-bold"
              onClick={() => (getRef(refId).current.style.display = "none")}
            >
              hide
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderColorInput = () => {
    const data = [
      {
        id: "backgroundColor",
        name: "color 1",
        description: "Color general de fondo",
      },
      {
        id: "boxBackgroundColor",
        name: "color 2",
        description: "Color del fondo de los elementos principales",
      },
      {
        id: "boxBorderColor",
        name: "color 3",
        description: "Color de los border de los elementos principales",
      },
      {
        id: "boxInnerTextColor",
        name: "color 4",
        description: "Color del texto interno de los elmentos principales",
      },
      {
        id: "boxTitleColor",
        name: "color 5",
        description: "Color del titulo interno de los elmentos principales",
      },
      {
        id: "titleColor",
        name: "color 6",
        description: "Color general del titulo",
      },
      {
        id: "textColor",
        name: "color 7",
        description: "Color general del texto",
      },
    ];

    console.log(JSON.stringify(dict))
    return data.map((item, index) => {
      return (
        <div key={index}  className="flex flex-row mb-3 py-3 border-b">
          <p  className="flex text-gray-600 w-1/5">{item.name}</p>
          <p  className="flex mr-auto font-light w-3/5">{item.description}</p>
          <div  className="mr-auto flex w-2/6">
            <input
               className="w-full border-2"
              style={{ backgroundColor: dict[item.id] }}
              onFocus={() => (getRef(item.id).current.style.display = "block")}
            />
            {renderColorPicker(item.id)}
          </div>
        </div>
      );
    });
  };

  const renderToggleInput = () => {
    const data = [
      {
        id: "pageAgenda",
        name: "Agenda",
        description: "Habilita el modulo de agenda",
      },
      {
        id: "pagePonentes",
        name: "Ponentes",
        description: "Habilita el modulo de ponentes",
      },
      {
        id: "pagePrensa",
        name: "Recursos",
        description: "Habilita el modulo de recursos",
      },
      {
        id: "pagePatrocinadores",
        name: "Patrocinadores",
        description: "Habilita el modulo de patrocinadores",
      }
    ]

    console.log("rendering")

    return (
      <>
        {data.map((item, index) => {

          return (
            <div key={index}  className="flex flex-row mb-3 py-3 border-b">
              <p  className="flex text-gray-600 w-1/5">{item.name}</p>
              <p  className="flex mr-auto font-light w-3/5">{item.description}</p>
              <div  className="mr-auto flex w-2/6 justify-center">
                <span  className="relative">
                  <span  className="block w-10 h-6 bg-gray-400 rounded-full shadow-inner"
                  onClick={() => {validate();  setDict(item.id, !dict[item.id])}}></span>
                  <span  className={ dict[item.id] ?
                              "absolute block w-4 h-4 mt-1 ml-1 rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out bg-purple-600 transform translate-x-full"
                            : "absolute block w-4 h-4 mt-1 ml-1 bg-white rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out"
                  }>
                    <input type="checkbox"  className="w-full absolute opacity-0 w-0 h-0"/>
                  </span>
                </span>
              </div>
            </div>
          )
        })}
      </>
    )
  }



  const renderModulosTab = () => {
    return (
      <>
        <div  className="py-5 border-b flex">
          <div  className="flex flex-col w-1/2">
            <p  className="text-xl mb-3">Modulos</p>
            <p  className="text-gray-500 font-extralight">
              Activa o desactiva ciertos modulos
            </p>
          </div>
          <div  className="flex flex-col w-1/2 justify-center items-end">
            {renderSpinner()}
            <button
              disabled={disabled}
               className="h-10 w-40 px-5 m-2 text-indigo-100 transition-colors duration-150 
                        bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800
                        disabled:opacity-50 disabled:cursor-default"
              onClick={setValue}
            >
              Guardar
            </button>
          </div>
        </div>
        <div  className="flex flex-col">
          <div  className="flex flex-row mb-3 py-3 border-b">
            <p  className="text-gray-600 w-1/5">Login</p>
            <p  className="mr-auto font-light w-3/5">
              Selecciona el tipo de autetificacion que quieres usar
            </p>
            <select
              id="login"
               className="py-2 px-3 border border-gray-300 w-2/6
                        bg-white rounded-md shadow-sm focus:outline-none 
                        focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={dict.login}
              onChange={(e) => {validate(); setDict(e.target.id, e.target.value)}}
            >
              <option value=""></option>
              <option value="con-registro">Con registro</option>
              <option value="sin-registro">Sin registro</option>
            </select>
          </div>
        </div>
        {renderToggleInput()}
      </>
    );
  };

  const renderColoresTab = () => {

    return (
      <>
        <div  className="py-5 border-b flex">
          <div  className="flex flex-col w-1/2">
            <p  className="text-xl mb-3">Diseño colores</p>
            <p  className="text-gray-500 font-extralight">
              Cambia los colores de la plataforma
            </p>
          </div>
          <div  className="flex flex-col w-1/2 justify-center items-end">
            {renderSpinner()}
            <button
              disabled={disabled}
               className="h-10 w-40 px-5 m-2 text-indigo-100 transition-colors duration-150 
                        bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800
                        disabled:opacity-50 disabled:cursor-default"
              onClick={setValue}
            >
              Guardar
            </button>
          </div>
        </div>
        <div>
          {renderColorInput()}
        </div>
      </>
    )
  }
  const renderImageTab = () => {
    return (
      <>
        <div  className="py-5 border-b flex">
          <div  className="flex flex-col w-1/2">
            <p  className="text-xl mb-3">Diseño imagenes</p>
            <p  className="text-gray-500 font-extralight">
              Cambia las imagenes de la plataforma
            </p>
          </div>
          <div  className="flex flex-col w-1/2 justify-center items-end">
            <button
              disabled={disabled}
               className="h-10 w-40 px-5 m-2 text-indigo-100 transition-colors duration-150 
                        bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800
                        disabled:opacity-50 disabled:cursor-default"
              onClick={setValue}
            >
              Guardar
            </button>
          </div>
          {renderSpinner()}
        </div>
        <div  className="flex flex-row mb-3 py-3 border-b">
          <p  className="text-gray-600 w-1/5">Logo</p>
          <p  className="mr-auto font-light w-3/5">
            Logo principal de la pagina
          </p>
          { dict["mainLogo"] != null ? 
            <div className="flex flex-row">
              <div className = "mx-5">
                {dict["mainLogo"]}
              </div>
              <div className="text-purple-500 cursor-pointer" onClick={()=> setDict("mainLogo", null)}> Cambiar </div>
            </div>
            :
            <input className="w-2/6" id="mainLogo" accept="png" type="file" 
              onChange={(e) => {
                validate(); 
                setDict(e.target.id, {"type": "file", "value": e.target.files[0]})}
              }
            />
          }
        </div>
        <div  className="flex flex-row mb-3 py-3 border-b">
          <p  className="text-gray-600 w-1/5">Fondo 1</p>
          <p  className="mr-auto font-light w-3/5">
            Imagen de fondo en la pagina de inicio
          </p>
          { dict["backgroundLoginImage"] != null ? 
            <div className="flex flex-row">
              <div className = "mx-5">
                {dict["backgroundLoginImage"]}
              </div>
              <div className="text-purple-500 cursor-pointer" onClick={()=> setDict("backgroundLoginImage", null)}> Cambiar </div>
            </div>
            :
            <input className="w-2/6" id="backgroundLoginImage" accept="png" type="file" 
              onChange={(e) => {
                validate(); 
                setDict(e.target.id, {"type": "file", "value": e.target.files[0]})}
              }
            />
          }
        </div>
      </>
    );
  };

  const renderTabContent = () => {
    switch (tab) {
      case 0:
        return renderModulosTab();
      case 1:
        return renderImageTab();
      default:
        return renderColoresTab();
    }
  };

  const renderSpinner = () => {
    return (
      <>
        {!loaded &&
          <div className="flex flex-col justify-center items-center mx-3">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="black" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        }
      </>
    )
  }


  return (
    <AdminLayout>
      <ContainerPage>
        <div
           className="flex flex-row items-center text-3xl"
        >
          <div  className={"flex cursor-pointer justify-center items-center ml-5 w-24 h-10 mb-0 rounded-lg rounded-b-none " 
                          + (tab === 0 ? "z-10 bg-white border-t-2 border-l-2 border-r-2 border-gray-200" : "bg-gray-300")}

                onClick={() => setTab(0)}>
            <p  className="text-sm">Modulos</p>
          </div>
          <div  className={"flex cursor-pointer justify-center items-center ml-2 w-24 h-10 mb-0 rounded-lg rounded-b-none "
                          + (tab === 1 ? "z-10 bg-white border-t-2 border-l-2 border-r-2 border-gray-200" : "bg-gray-300")}
                onClick={() => setTab(1)}>
            <p  className="text-sm">Imagenes</p>
          </div>
          <div  className={"flex cursor-pointer justify-center items-center ml-2 w-24 h-10 mb-0 rounded-lg rounded-b-none "
                          + (tab === 2 ? "z-10 bg-white border-t-2 border-l-2 border-r-2 border-gray-200" : "bg-gray-300")}
                onClick={() => setTab(2)}>
            <p  className="text-sm">Colores</p>
          </div>
          <div  className={"flex cursor-pointer justify-center items-center ml-2 w-24 h-10 mb-0 rounded-lg rounded-b-none bg-red-500"}
                onClick={() => deleteSettings()}>
            <p  className="text-sm">Reset</p>
          </div>
        </div>
        <div
           className="bg-white rounded-lg shadow py-10 px-20 overflow-auto"
          style={{ height: "94%" }}
        >
          {renderTabContent()}
        </div>
      </ContainerPage>
    </AdminLayout>
  );
}
