import AdminLayout from "../../layouts/adminLayout";
import ContainerPage from "../../components/containers";
import React, { useContext, useEffect, useRef, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";

import { setDictValue } from "../../utils/hooksLib";
import { AuthContext } from "../../utils/functionsLib";
import { ChromePicker } from "react-color";
import useDynamicRefs from "use-dynamic-refs";

import * as mutations from "../../config/graphql/mutations";

export default function PlatformControl(props) {
  const authContext = useContext(AuthContext);
  const [disabled, setDisabled] = useState(true);
  const [appID, setAppId] = useState(null);
  const [getRef, setRef] = useDynamicRefs();
  const [tab, setTab] = useState(0);

  const [dict, setDict] = setDictValue({
    login: "",
    mainLogo: "",
    backgroundLoginImage: "",
    backgroundColor: "",
    boxBackgroundColor: "",
    boxBorderColor: "",
    boxInnerTextColor: "",
    boxTitleColor: "",
    titleColor: "",
    textColor: "",
    pageAgenda: false,
    pagePonentes: false,
    pagePatrocinadores: false,
    pagePrensa: false,
    pageContacto: false,
  });

  useEffect(() => {
    //set value from loaded general settings into local dict
    try {
      for (let key in authContext.generalSettings[0]) {
        if (key === "id") {
          setAppId(authContext.generalSettings[0][key]);
        } else {
          setDict(key, authContext.generalSettings[0][key]);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const setDictFromInput = (event) => {
    console.log(event);
    setDict(event.target.id, event.target.value);
    setDisabled(false);
  };

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
    API.graphql(
      graphqlOperation(mutations.createGeneralSettings, { input: dict })
    );
  };

  const updateSettings = () => {
    const dictAndId = { ...dict, id: appID };

    API.graphql(
      graphqlOperation(mutations.updateGeneralSettings, { input: dictAndId })
    );
  };

  const validate = () => {
    // check if all items in dict are populated
    for (let key in dict) {
      if (dict[key] === "") {
        setDisabled(true);
        return false;
      }
    }
    return true;
  };

  const renderColorPicker = (refId) => {
    console.log(refId);
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
                onChange={(color) => setDict(refId, color.hex)}
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

  const renderMain = () => {
    return (
      <>
        <div className="py-5 border-b flex">
          <div className="flex flex-col w-1/2">
            <p className="text-xl mb-3">Diseño general</p>
            <p className="text-gray-500 font-extralight">
              Cambia el diseño del evento
            </p>
          </div>
          <div className="flex flex-col w-1/2 justify-center items-end">
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
              onChange={setDictFromInput}
            >
              <option value=""></option>
              <option value="con-registro">Con registro</option>
              <option value="sin-registro">Sin registro</option>
            </select>
          </div>

          {renderColorInput()}
        </div>
      </>
    );
  };

  const renderImageTab = () => {
    return (
      <>
        <div className="py-5 border-b flex">
          <div className="flex flex-col w-1/2">
            <p className="text-xl mb-3">Diseño general</p>
            <p className="text-gray-500 font-extralight">
              Cambia el diseño del evento
            </p>
          </div>
          <div className="flex flex-col w-1/2 justify-center items-end">
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
        <div className="flex flex-row mb-3 py-3 border-b">
          <p className="text-gray-600 w-1/5">Logo</p>
          <p className="mr-auto font-light w-3/5">
            Logo principal de la pagina
          </p>
          <input className="w-2/6" id="mainLogo" accept="png" type="file" />
        </div>
        <div className="flex flex-row mb-3 py-3 border-b">
          <p className="text-gray-600 w-1/5">Fondo 1</p>
          <p className="mr-auto font-light w-3/5">
            Imagen de fondo en la pagina de inicio
          </p>
          <input className="w-2/6" id="mainLogo" accept="png" type="file" />
        </div>
      </>
    );
  };

  const renderTabContent = () => {
    switch (tab) {
      case 0:
        return renderMain();
      case 1:
        return renderImageTab();
      default:
        return <Chat />;
    }
  };

  return (
    <AdminLayout>
      <ContainerPage>
        <div
          className="flex flex-row items-center text-3xl "
          style={{ height: "6%" }}
        >
          <div className="mx-10 w-24 h-full bg-white rounded-lg rounded-b-none shadow" onClick={() => setTab(0)}>
            0
          </div>
          <div className="" onClick={() => setTab(1)}>
            1
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
