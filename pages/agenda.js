import { AuthContext } from "../utils/functionsLib";
import { useRouter } from "next/router";
import GeneralLayout from "../components/generalLayout";
import React, { useState, useEffect, useContext } from "react";
import { API, graphqlOperation } from "aws-amplify";
import * as mutations from "../config/graphql/mutations";
import * as queries from "../config/graphql/queries";
import * as subscriptions from "../config/graphql/subscriptions";

import { useFormFields } from "../utils/hooksLib";


export default function Agenda() {

  /**
   * To do
   * 
   * - Improve modal
   * - Display date in a cleaner way
   * - Integrate user auth
   */
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);

  const [selectedTab, setSelectedTab] = useState(0);
  const [isAdmin, setIsAdmin] = useState(true);
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const [fields, handleFieldChange] = useFormFields({
    title: "",
    description: "",
    date: "",
  });

  const [datetime, handleDatetimeChange] = useFormFields({
    month: "",
    day: "",
    hour: "",
    minute: "",
  });

  useEffect(() => {
    if (!authContext.isLoggedIn) {
      console.log("not logged in");
      router.push("/login");
    } else {
      console.log(authContext.userData);
      //router.push('/userControl');
    }
    setIsLoading(false);

    onPageRendered();
  }, []);

  const onPageRendered = async () => {
    getEvents();
    subscribeCreateEvent();
    subscribeDeleteEvent();
  };

  const subscribeCreateEvent = async () => {
    await API.graphql(graphqlOperation(subscriptions.onCreateEvent)).subscribe({
      next: (subonCreateEvent) => {
        setEvents((events) => [
          ...events,
          subonCreateEvent.value.data.onCreateEvent,
        ]);
      },
    });
  };

  const subscribeDeleteEvent = async () => {
    await API.graphql(graphqlOperation(subscriptions.onDeleteEvent)).subscribe({
      next: (subonDeleteEvent) => {
        setEvents((events) => [
          ...events.filter(event => event.id != subonDeleteEvent.value.data.onDeleteEvent.id)
        ]);
        
      },    
    });
  };

  const getEvents = () => {
    API.graphql(graphqlOperation(queries.listEvents)).then((data) =>
      setEvents(data.data.listEvents.items)
    );
  };

  const deleteEvent = (id) => {
    var itemDetails = {
      id: id,
    };
    API.graphql(
      graphqlOperation(mutations.deleteEvent, { input: itemDetails })
    );
  };

  const createEvent = (e) => {
    var itemDetails = {
      title: fields.title,
      description: fields.description,
      date: new Date(
        2020,
        datetime.month,
        datetime.day,
        datetime.hour,
        datetime.minute
      ).toString(),
    };

    console.log("Event Details : " + JSON.stringify(itemDetails));
    API.graphql(
      graphqlOperation(mutations.createEvent, { input: itemDetails })
    );
  };

  const handleDatetimeInput = (e) => {
    var toInt = Number(e.target.value);

    switch (e.target.id) {
      case "day":
        if (toInt !== NaN && toInt < 32 && toInt > -1) {
          handleDatetimeChange(e);
          break;
        }
      case "hour":
        if (toInt !== NaN && toInt < 13 && toInt > -1) {
          handleDatetimeChange(e);
          break;
        }
      case "minute":
        if (toInt !== NaN && toInt < 60 && toInt > -1) {
          handleDatetimeChange(e);
          break;
        }
      default:
        console.log("error");
    }
  };

  const parseDates = (dataArray) => {
    /**
     * set dates as key and group items by date
     */

    let dataDict = {};

    dataArray.sort(function (a, b) {
      var c = new Date(a.date);
      var d = new Date(b.date);
      return c - d;
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
    let classString;
    let parsedEvents = parseDates(events);

    for (var key in parsedEvents) {
      switch (index) {
        case selectedTab:
          classString = "px-28 bg-blue-900 hover:bg-blue-800";
          break;
        case selectedTab + 1:
          classString = "px-10 hover:bg-gray-500 bg-gray-400";
          break;
        default:
          classString = "px-10 hover:bg-gray-400 bg-gray-300";
      }

      dataArray.push(
        <div
          class={"text-white py-0.5 text-lg cursor-pointer " + classString}
          id={key}
          tabIndex={index}
          onClick={(e) => {
            setSelectedTab(e.target.tabIndex);
          }}
        >
          DÍA {index + 1}
        </div>
      );
      index++;
    }

    return dataArray;
  };

  const renderEvents = () => {
    
    let parsedEvents = parseDates(events);
    let currentKey; let index = 0;

    for(var key in parsedEvents){
        if(index == selectedTab){
            currentKey = key;
        }
        index ++;
    }

    return (
      <>
        {parsedEvents[currentKey] ? (
          parsedEvents[currentKey].map((event, key) => {
            return (
              <div class="w-full h-24 border-dashed flex flex-col justify-center align-center items-center">
                <div id="head" class="h-1/4 flex flex-row w-full">
                  <div class="text-center bg-gray-400 text-gray-100 w-full">
                    {event.title} -
                    {new Date(event.date).toLocaleTimeString([], {
                      timeStyle: "short",
                    })}
                  </div>
                  {isAdmin && (
                    <div
                      id={event.id}
                      class="bg-red-500 text-white text-center cursor-pointer"
                      style={{ width: "5%" }}
                      onClick={(e) => {
                        deleteEvent(e.target.id);
                      }}
                    >
                      -
                    </div>
                  )}
                </div>

                <div
                  class="font-thin h-3/4 bg-blue-50 w-full text-blue-700 p-2 text-center"
                  id="body"
                >
                  {event.description}
                </div>
              </div>
            );
          })
        ) : (
          <></>
        )}
        {isAdmin && (
          <div
            class="w-full h-24 border-dashed flex border-gray-400 border-2 cursor-pointer justify-center text-gray-500
                   align-center items-center hover:bg-gray-400 hover:text-white"
            onClick={(e) => {
              setShowModal(true);
            }}
          >
            <div class="text-lg" id="body">
              AÑADE UNA NUEVA ENTRADA
            </div>
          </div>
        )}
      </>
    );
  };

  const renderDatetimePicker = () => {
    const MONTH_NAMES = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return (
      <div class="flex flex-row space-x-1 items-center">
        <input
          id="day"
          value={datetime.day}
          class="w-12 bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg
               text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
          type="text"
          onChange={(e) => {
            handleDatetimeInput(e);
          }}
        />
        <select
          id="month"
          value={datetime.month}
          class="mt-1 self-center block py-2 px-3 border border-gray-300 bg-white rounded-md 
               shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          onChange={handleDatetimeChange}
        >
          {MONTH_NAMES.map((month, key) => {
            return <option>{key}</option>;
          })}
        </select>
        <input
          id="hour"
          value={datetime.hour}
          class="mr-auto w-12 bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg
               text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
          type="text"
          onChange={(e) => {
            handleDatetimeInput(e);
          }}
        />
        <input
          id="minute"
          value={datetime.minute}
          class="w-12 bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg
               text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
          type="text"
          onChange={(e) => {
            handleDatetimeInput(e);
          }}
        />
      </div>
    );
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
              setShowModal(false);
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

          <div class="shadow w-full rounded-lg bg-white overflow-hidden w-full block p-8">
            <h2 class="font-bold text-2xl mb-6 text-gray-800 border-b pb-2">
              Add Event Details
            </h2>

            <div class="mb-4">
              <label class="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
                Event title
              </label>
              <input
                id="title"
                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                type="text"
                onChange={handleFieldChange}
              />
            </div>
            <div class="mb-4">
              <label class="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
                Event description
              </label>
              <input
                id="description"
                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                type="text"
                onChange={handleFieldChange}
              />
            </div>

            <div class="mb-4">
              <label class="text-gray-800 block mb-1 font-bold text-sm tracking-wide">
                Event date
              </label>
              {renderDatetimePicker()}
            </div>

            <div class="mt-8 text-right">
              <button
                type="button"
                class="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm mr-2"
              >
                Cancel
              </button>
              <button
                type="button"
                class="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 border border-gray-700 rounded-lg shadow-sm"
                onClick={(e) => {
                  createEvent();
                  setShowModal(false);
                }}
              >
                Save Event
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <GeneralLayout>
          {showModal ? renderModal() : <></>}
          <div class="max-w-7xl mx-auto w-full">
            <div class="flex mx-auto justify-center p-8">{renderTabs()}</div>
            <div class="flex flex-col space-y-4 max-w-screen-sm cointainer mx-auto">
              {renderEvents()}
            </div>
          </div>
        </GeneralLayout>
      )}
    </>
  );
}
