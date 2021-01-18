import React, { useState, useEffect, useContext } from "react";
import { API, graphqlOperation } from "aws-amplify";

import GeneralLayout from "../layouts/generalLayout";
import {ContainerPage} from "../components/containers";
import Modal from "../components/modal";

import { AuthContext } from "../utils/functionsLib";
import { useModalFields } from "../utils/hooksLib";

import * as mutations from "../config/graphql/mutations";
import * as queries from "../config/graphql/queries";
import * as subscriptions from "../config/graphql/subscriptions";

export default function Agenda() {
  /**
   * To do
   *
   * - Improve modal
   * - Display date in a cleaner way
   */

  const authContext = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [agendas, setAgendas] = useState([]);
  const [parsedAgendas, setParsedAgendas] = useState({});
  const [selectedTab, setSelectedTab] = useState(0);
  const [isMobile, setIsMobile] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const [fields, handleFieldChange] = useModalFields({
    title: { type: "default", value: "" },
    description: { type: "default", value: "" },
    date: { type: "date", value: {day: 0, month: 0, hour: 0, minute: 0} },
  });


  useEffect(() => {
    onPageRendered();

  }, []);

  useEffect(() => {
    setParsedAgendas(parseDates(agendas));

  }, [agendas])


  useEffect(() => {
    handleResize();
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleResize = () => {

    if (window.screen.width >= 640) {
      setIsMobile(false)
    } else {
      setIsMobile(true)
    }
 }

  const onPageRendered = async () => {
    getAgendas();
    subscribeCreateAgenda();
    subscribeDeleteAgenda();
  };

  const subscribeCreateAgenda = async () => {
    await API.graphql(graphqlOperation(subscriptions.onCreateAgenda)).subscribe({
      next: (subonCreateAgenda) => {
        setAgendas((agendas) => [
          ...agendas,
          subonCreateAgenda.value.data.onCreateAgenda,
        ]);
      },
    });
  };

  const subscribeDeleteAgenda = async () => {
    await API.graphql(graphqlOperation(subscriptions.onDeleteAgenda)).subscribe({
      next: (subonDeleteAgenda) => {
        setAgendas((agendas) => [
          ...agendas.filter(
            (agenda) => agenda.id != subonDeleteAgenda.value.data.onDeleteAgenda.id
          ),
        ]);
      },
    });
  };

  const getAgendas = () => {
    API.graphql(graphqlOperation(queries.listAgendas)).then((data) =>
      setAgendas(data.data.listAgendas.items)
    );
  };

  const deleteAgenda = (id) => {
    var itemDetails = {
      id: id,
    };
    API.graphql(
      graphqlOperation(mutations.deleteAgenda, { input: itemDetails })
    );
  };

  const createAgenda = (e) => {
    setIsCreating(true);
    console.log(fields);
    
    var itemDetails = {
      title: fields.title.value,
      description: fields.description.value,
      date: new Date(
        2020,
        fields.date.value.month,
        fields.date.value.day,
        fields.date.value.hour,
        fields.date.value.minute
      ).toString()
    };

    console.log("Agenda Details : " + JSON.stringify(itemDetails));
    API.graphql(
      graphqlOperation(mutations.createAgenda, { input: itemDetails })
    );
    setIsCreating(false);
    setShowModal(false);
  };



  const parseDates = (dataArray) => {
    /**
     * set dates as key and group items by date
     */

    let dataDict = {};

    dataArray.sort(function (a, b) {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    dataArray.map((item, index) => {
      let key = new Date(item.date).toDateString();
      if (dataDict[key] === undefined) {
        dataDict[key] = [item];
      } else {
        dataDict[key].push(item);
      }
    });

    return dataDict;
  };

  const renderTabs = () => {
    let dataArray = [];
    let index = 0;
    let classNameString;

    for (var key in parsedAgendas) {
      switch (index) {
        case selectedTab:
          classNameString = "px-28 bg-blue-900 hover:bg-blue-800";
          break;
        case selectedTab + 1:
          classNameString = "px-10 hover:bg-gray-500 bg-gray-400";
          break;
        default:
          classNameString = "px-10 hover:bg-gray-400 bg-gray-300";
      }

      dataArray.push(
        <div
          className={
            "text-white py-0.5 text-lg cursor-pointer " + classNameString
          }
          id={key}
          tabIndex={index}
          onClick={(e) => {
            setSelectedTab(e.target.tabIndex);
          }}
        >
          {new Date(parsedAgendas[key][0].date).toLocaleDateString([], {
            dateStyle: "short",
          })}
        </div>
      );
      index++;
    }
    return dataArray;
  };

  const renderTabsMobile = () => {

    let dataArray = [];
    let index = 0;

    for (var key in parsedAgendas) {
      dataArray.push(
        <option
          id={key}
          value={index}
        >
          {" "}
          {new Date(parsedAgendas[key][0].date).toLocaleDateString([], {
            dateStyle: "short",
          })}
        </option>
      );
      index++;
    }

    return (
      <select
        className="mt-1 self-center block py-2 px-3 border border-gray-300 bg-white rounded-md text-center
      shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm w-48"
        onChange={(e) => {
          setSelectedTab(e.target.value);
        }}
      >
        {dataArray}
      </select>
    );

  }

  
  const renderAgendas = () => {

    let currentKey;
    let index = 0;

    for (var key in parsedAgendas) {
      if (index == selectedTab) {
        currentKey = key;
      }
      index++;
    }

    return (
      <>
        {parsedAgendas[currentKey] ? (
          parsedAgendas[currentKey].map((agenda, key) => {
            return (
              <div className="w-full h-24 border-dashed flex flex-col justify-center align-center items-center">
                <div id="head" className="h-1/4 flex flex-row w-full">
                  <div className="text-center bg-gray-400 text-gray-100 w-full">
                    {agenda.title} - {" "}
                    {new Date(agenda.date).toLocaleTimeString([], {
                      timeStyle: "short"
                    })}
                  </div>
                  {authContext.isAdmin && (
                    <div
                      id={agenda.id}
                      className="bg-red-500 text-white text-center cursor-pointer"
                      style={{ width: "5%" }}
                      onClick={(e) => {
                        deleteAgenda((e.target.id));
                      }}
                    >
                      -
                    </div>
                  )}
                </div>

                <div
                  className="font-thin h-3/4 bg-blue-50 w-full text-blue-700 p-2 text-center"
                  id="body"
                >
                  {agenda.description}
                </div>
              </div>
            );
          })
        ) : (
          <></>
        )}
        {authContext.isAdmin && (
          <div
            className="w-full h-24 border-dashed flex border-gray-400 border-2 cursor-pointer justify-center text-gray-500
                   align-center items-center hover:bg-gray-400 hover:text-white"
            onClick={(e) => {
              setShowModal(true);
            }}
          >
            <div className="text-lg" id="body">
              AÑADE UNA NUEVA ENTRADA
            </div>
          </div>
        )}
      </>
    );
  };
 
  return (
    <GeneralLayout>
      <ContainerPage>
        <Modal
          element={"Agenda"}
          fields={fields}
          handleFieldChange={handleFieldChange}
          submit={createAgenda}
          showModal={showModal}
          setShowModal={setShowModal}
          isCreating={isCreating}
        />
        <div className="mb-auto mx-auto w-full max-w-screen-md">
          <div className="flex text-xl my-8 sm:text-2x1 lg:text-3xl">
            Agenda
          </div>
          <div className="flex mx-auto justify-center mb-3 sm:p-8">
            {isMobile ? renderTabsMobile() : renderTabs()}
          </div>
          <div className="flex flex-col space-y-4">{renderAgendas()}</div>
        </div>
      </ContainerPage>
    </GeneralLayout>
  );
}
