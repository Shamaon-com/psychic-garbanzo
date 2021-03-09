import AdminLayout from "../../layouts/adminLayout";
import ContainerPage from "../../components/containers/containerPage";
import React, { useContext, useEffect, useRef, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { setDictValue } from "../../utils/hooksLib";
import { AuthContext, uploadToS3 } from "../../utils/functionsLib";
import { ChromePicker } from "react-color";
import useDynamicRefs from "use-dynamic-refs";

import * as mutations from "../../src/graphql/mutations";

const PlatformControl = (props) => {

  const authContext = useContext(AuthContext);
  const [disabled, setDisabled] = useState(false);
  const [appID, setAppId] = useState(null);
  const [getRef, setRef] = useDynamicRefs();
  const [tab, setTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [mainLogoObject, setMainLogoObject] = useState({});
  const [backgroundLoginImage, setBackgroundLoginImage] = useState({});
  const [initalState, setInitalState] = useState({
    login: "con-registro",
    mainLogo: "",
    backgroundLoginImage: "",
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
    pageRecursos: false,
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
  }, []);

  const setValue = () => {
    /**
     * If id is empty we create new settings, but we need
     * to check that all fields are populated
     * else we just update the settings with the new values
     */
    setIsLoading(true);
    if (validate(dict)) {
      appID === null ? createSettings() : updateSettings()
    }
  };


  const validate = (fields) => {
    for (var field in fields) {
      console.log(field, fields[field])

      if (fields[field] === null) {
        alert("rellene todos los campos");
        return false;
      }
      else if (field !== "backgroundLoginImage" && (fields[field] === "" || (Object.keys(fields[field]).length === 0 && fields[field].constructor === Object))) {
        alert("Rellene todos los campos " + field);
        return false;
      }
    }
    return true;
  };

  const createSettings = () => {

    API.graphql(
      graphqlOperation(mutations.createGeneralSettings, { input: dict })
    );

    setTimeout(() => { setIsLoading(false); }, 3000);

  };

  const updateSettings = () => {

    var dictAndId = { ...dict, id: appID };


    if (initalState["mainLogo"] !== dict["mainLogo"]) {
      setIsUploading(true);
      uploadToS3(mainLogoObject.value, setIsUploading);
    }

    if (initalState["backgroundLoginImage"] !== dict["backgroundLoginImage"] && dict["backgroundLoginImage"] != "") {
      setIsUploading(true);
      uploadToS3(backgroundLoginImage.value, setIsUploading);
    }

    API.graphql(
      graphqlOperation(mutations.updateGeneralSettings, { input: dictAndId })
    );

    setTimeout(() => { setIsLoading(false); }, 3000);
  };

  const deleteSettings = () => {

    if (window.confirm('Estas seguro de que quieres resetear la configuracion?')) {
      console.log(appID)
      API.graphql(
        graphqlOperation(mutations.deleteGeneralSettings, { input: { id: appID } })
      ).then(() => {
        //location.reload()
      });
    }
  };



  const renderColorPicker = (refId) => {
    return (
      <div className="absolute">
        <div
          className="relative"
          ref={setRef(refId)}
          style={{ display: "none" }}
        >
          <div className="flex flex-row">
            <div className="flex w-4/5">
              <ChromePicker
                color={dict[refId]}
                onChange={(color) => { setDict(refId, color.hex) }}
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
        <div key={index} className="flex flex-row mb-3 py-3 border-b">
          <p className="flex text-gray-600 w-1/5">{item.name}</p>
          <p className="flex mr-auto font-light w-3/5">{item.description}</p>
          <div className="mr-auto flex w-2/6">
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
        id: "pageRecursos",
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
            <div key={index} className="flex flex-row mb-3 py-3 border-b">
              <p className="flex text-gray-600 w-1/5">{item.name}</p>
              <p className="flex mr-auto font-light w-3/5">{item.description}</p>
              <div className="mr-auto flex w-2/6 justify-center">
                <span className="relative">
                  <span className="block w-10 h-6 bg-gray-400 rounded-full shadow-inner"
                    onClick={() => { validate(); setDict(item.id, !dict[item.id]) }}></span>
                  <span className={dict[item.id] ?
                    "absolute block w-4 h-4 mt-1 ml-1 rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out bg-purple-600 transform translate-x-full"
                    : "absolute block w-4 h-4 mt-1 ml-1 bg-white rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out"
                  }>
                    <input type="checkbox" className="w-full absolute opacity-0 w-0 h-0" />
                  </span>
                </span>
              </div>
            </div>
          )
        })}
      </>
    )
  }

  const renderButton = () => {
    return (
      <button
        disabled={disabled}
        className={`h-10 w-40 px-5 m-2 text-indigo-100 transition-colors duration-150 \
                bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800 \
                disabled:opacity-50 disabled:cursor-default ${isLoading || isUploading && "animate-pulse"}`}
        onClick={setValue}
      >
        Guardar
      </button>
    )
  }

  const renderModulosTab = () => {
    /*
            <div className="flex flex-col">
          <div className="flex flex-row mb-3 py-3 border-b">
            <p className="text-gray-600 w-1/5">Login</p>
            <p className="mr-auto font-light w-3/5">
              Selecciona el tipo de autetificacion que quieres usar
            </p>
            <select
              id="login"
              className="py-2 px-3 border border-gray-300 w-2/6
                        bg-white rounded-md shadow-sm focus:outline-none 
                        focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={dict.login}
              onChange={(e) => { validate(); setDict(e.target.id, e.target.value) }}
            >
              <option value=""></option>
              <option value="con-registro">Con registro</option>
              <option value="sin-registro">Sin registro</option>
            </select>
          </div>
        </div>
      */
    return (
      <>
        <div className="py-5 border-b flex">
          <div className="flex flex-col w-1/2">
            <p className="text-xl mb-3">Modulos</p>
            <p className="text-gray-500 font-extralight">
              Activa o desactiva ciertos modulos
            </p>
          </div>
          <div className="flex flex-col w-1/2 justify-center items-end">
            {renderButton()}
          </div>
        </div>
        {renderToggleInput()}
      </>
    );
  };

  const renderColoresTab = () => {

    return (
      <>
        <div className="py-5 border-b flex">
          <div className="flex flex-col w-1/2">
            <p className="text-xl mb-3">Diseño colores</p>
            <p className="text-gray-500 font-extralight">
              Cambia los colores de la plataforma
            </p>
          </div>
          <div className="flex flex-col w-1/2 justify-center items-end">
            {renderButton()}
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
        <div className="py-5 border-b flex">
          <div className="flex flex-col w-1/2">
            <p className="text-xl mb-3">Diseño imagenes</p>
            <p className="text-gray-500 font-extralight">
              Cambia las imagenes de la plataforma
            </p>
          </div>
          <div className="flex flex-col w-1/2 justify-center items-end">
            {renderButton()}
          </div>
        </div>
        <div className="flex flex-row mb-3 py-3 border-b">
          <p className="text-gray-600 w-1/5">Logo</p>
          <p className="mr-auto font-light w-3/5">
            Logo principal de la pagina
          </p>
          {dict["mainLogo"] != null ?
            <div className="flex flex-row">
              <div className="mx-5">
                {dict["mainLogo"]}
              </div>
              <div className="text-purple-500 cursor-pointer" onClick={() => setDict("mainLogo", null)}> Cambiar </div>
            </div>
            :
            <input className="w-2/6" id="mainLogo" accept="png" type="file"
              onChange={(e) => {
                validate();
                setMainLogoObject({ "type": "file", "value": e.target.files[0] })
                setDict(e.target.id, e.target.files[0].name)
              }
              }

            />
          }
        </div>
        <div className="flex flex-row mb-3 py-3 border-b">
          <p className="text-gray-600 w-1/5">Fondo 1</p>
          <p className="mr-auto font-light w-3/5">
            Imagen de fondo en la pagina de inicio
          </p>
          <div className="flex flex-row justify-right">
            <div className="mr-5 text-red-500 cursor-pointer" onClick={() => setDict("backgroundLoginImage", "")}> X </div>
            {dict["backgroundLoginImage"] != null ?
              <>
                <div className="mx-5">
                  {dict["backgroundLoginImage"].value != undefined ? dict["backgroundLoginImage"].value.name : dict["backgroundLoginImage"]}
                </div>
                <div className="text-purple-500 cursor-pointer" onClick={() => setDict("backgroundLoginImage", null)}> Cambiar </div>
              </>
              :
              <input className="w-60" id="backgroundLoginImage" accept="png" type="file"
                onChange={(e) => {
                  validate();
                  setBackgroundLoginImage({ "type": "file", "value": e.target.files[0] })
                  setDict(e.target.id, e.target.files[0].name)
                }
                }
              />
            }
          </div>
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


  return (
    <ContainerPage>
      <div
        className="flex flex-row items-center text-3xl"
      >
        <div className={"flex cursor-pointer justify-center items-center ml-5 w-24 h-10 mb-0 rounded-lg rounded-b-none "
          + (tab === 0 ? "z-10 bg-white border-t-2 border-l-2 border-r-2 border-gray-200" : "bg-gray-300")}

          onClick={() => setTab(0)}>
          <p className="text-sm">Modulos</p>
        </div>
        <div className={"flex cursor-pointer justify-center items-center ml-2 w-24 h-10 mb-0 rounded-lg rounded-b-none "
          + (tab === 1 ? "z-10 bg-white border-t-2 border-l-2 border-r-2 border-gray-200" : "bg-gray-300")}
          onClick={() => setTab(1)}>
          <p className="text-sm">Imagenes</p>
        </div>
        <div className={"flex cursor-pointer justify-center items-center ml-2 w-24 h-10 mb-0 rounded-lg rounded-b-none "
          + (tab === 2 ? "z-10 bg-white border-t-2 border-l-2 border-r-2 border-gray-200" : "bg-gray-300")}
          onClick={() => setTab(2)}>
          <p className="text-sm">Colores</p>
        </div>
        <div className={"flex cursor-pointer justify-center items-center ml-2 w-24 h-10 mb-0 rounded-lg rounded-b-none bg-red-500"}
          onClick={() => deleteSettings()}>
          <p className="text-sm">Reset</p>
        </div>
      </div>
      <div
        className="bg-white rounded-lg shadow py-10 px-20 overflow-auto"
        style={{ height: "94%" }}
      >
        {renderTabContent()}
      </div>
    </ContainerPage>
  );
}

PlatformControl.layout = AdminLayout;

export default PlatformControl;


