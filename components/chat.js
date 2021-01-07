import React, { useState, useEffect, useRef } from "react";
import { API, graphqlOperation } from "aws-amplify";
import * as mutations from "../config/graphql/mutations";
import * as queries from "../config/graphql/queries";
import * as subscriptions from "../config/graphql/subscriptions";

import useDynamicRefs from "use-dynamic-refs";

export default function Chat({ ...props }) {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [getRef, setRef] = useDynamicRefs();
  const [isAdmin, setIsAdmin ] = useState(false);
  const [user, setUser] = useState({})
  const messagesEndRef = useRef(null);

  /**
   * Init
   * 
   * - Missing setting is user is auth
   */


  useEffect(() => {
    onPageRendered();
    if(props.authContext.userGroup){
      setIsAdmin(props.authContext.userGroup.includes('admins'));
      setUser(props.authContext.userData.attributes.email)
      console.log(props.authContext.userData)
    }
  }, []);



  const onPageRendered = async () => {
    getMessages();
    subscribeCreateMessage();
    subscribeDeleteMessage();
  };

  /**
   * CRUD Operation functions
   */

  const getMessages = () => {
    API.graphql(graphqlOperation(queries.listMessages)).then((data) => {
      setMessages(sortArray(data.data.listMessages.items));
      scrollToBottom();
    });
  };


  const subscribeDeleteMessage = async () => {
    await API.graphql(graphqlOperation(subscriptions.onDeleteMessage)).subscribe({
      next: (subonDeleteEvent) => {
        setMessages((messages) => 
          sortArray([...messages.filter(message => message.id != subonDeleteEvent.value.data.onDeleteMessage.id)])
        );
        
      },    
    });
  };


  const deleteMessage = (e) => {

    var target = e.target;
    while (target && target.id === "") {
      target = target.parentNode;
      console.log(target);
    }

    var itemDetails = {
      id: target.id,
    };
    API.graphql(
      graphqlOperation(mutations.deleteMessage, { input: itemDetails })
    );
  };


  const subscribeCreateMessage = async () => {
    await API.graphql(
      graphqlOperation(subscriptions.onCreateMessage)
    ).subscribe({
      next: (subonCreateEvent) => {
        console.log("message sub create");
        setMessages((messages) =>
          sortArray([...messages, subonCreateEvent.value.data.onCreateMessage])
        );
        scrollToBottom();
      },
    });
  };


  const createMessage = (e) => {
    if (message === "") {
      alert("Mensaje vacio");
      return;
    }

    var itemDetails = {
      user: user,
      message: message,
    };

    console.log("Event Details : " + JSON.stringify(itemDetails));
    API.graphql(
      graphqlOperation(mutations.createMessage, { input: itemDetails })
    );
    setMessage("");
  };


  /**
   * 
   * Utils
   */

  const sortArray = (array) => {
    return array.sort(function (a, b) {
      var c = new Date(a.createdAt);
      var d = new Date(b.createdAt);
      return c - d;
    });
  };



  /**
   * UI Functions
   */

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView();
  };


  const showDelete = (e) => {
    if (isAdmin) {
      var target = e.target;
      while (target && target.id === "") {
        target = target.parentNode;
      }
      const showDeleteRef = getRef(target.id);
      showDeleteRef.current.style.display = "block";
    }
  };

  const hideDelete = (e) => {
    if (isAdmin) {
      var target = e.target;
      while (target && target.id === "") {
        target = target.parentNode;
      }
      const showDeleteRef = getRef(target.id);
      showDeleteRef.current.style.display = "none";
    }
  };



  /**
   *  Render Functions
   */

  const renderMessages = () => {
    return (
      <>
        {messages.map((message, key) => {
          let classVar =
            "bg-white text-gray-700 p-2 self-start my-2 rounded-md shadow mr-3";
          if (message.user !== user) {
            classVar =
              "bg-green-500 text-white p-2 self-end my-2 rounded-md shadow ml-3";
          }
          return (
            <div
              key={key}
              id={message.id}
              class={classVar}
              onMouseEnter={showDelete}
              onMouseLeave={hideDelete}
            >
            {isAdmin &&
              <svg
                ref={setRef(message.id)}
                style={{ display: "none", width: "20px" }}
                class="ml-auto p-0.5 cursor-pointer"
                viewBox="0 0 512 512"
                width="512pt"
                xmlns="http://www.w3.org/2000/svg"
                onClick={deleteMessage}
              >
                <path
                  d="m256 0c-141.164062 0-256 114.835938-256 256s114.835938 256 256 256 256-114.835938 256-256-114.835938-256-256-256zm0 0"
                  fill="#f44336"
                />
                <path
                  d="m350.273438 320.105469c8.339843 8.34375 8.339843 21.824219 0 30.167969-4.160157 4.160156-9.621094 6.25-15.085938 6.25-5.460938 0-10.921875-2.089844-15.082031-6.25l-64.105469-64.109376-64.105469 64.109376c-4.160156 4.160156-9.621093 6.25-15.082031 6.25-5.464844 0-10.925781-2.089844-15.085938-6.25-8.339843-8.34375-8.339843-21.824219 0-30.167969l64.109376-64.105469-64.109376-64.105469c-8.339843-8.34375-8.339843-21.824219 0-30.167969 8.34375-8.339843 21.824219-8.339843 30.167969 0l64.105469 64.109376 64.105469-64.109376c8.34375-8.339843 21.824219-8.339843 30.167969 0 8.339843 8.34375 8.339843 21.824219 0 30.167969l-64.109376 64.105469zm0 0"
                  fill="#fafafa"
                />
              </svg>
            }
              <div class="text-sm">
                {message.user.split("@")[0]} -{ " "}
                {new Date(message.createdAt).toLocaleTimeString()}
              </div>
              {message.message}
            </div>
          );
        })}

        <div ref={messagesEndRef}></div>
      </>
    );
  };

  return (
    <div class="flex flex-col items-end w-full h-full py-10">
      <div class="chat-modal flex flex-col w-full h-full border-8 border-gray-400">
        <div class="flex justify-between items-center text-white p-1 bg-gray-500 shadow-lg mr-5 w-full">
          <div class="flex items-center">
            <h2 class="font-semibold tracking-wider">Chat</h2>
          </div>
        </div>
        <div class="flex flex-col bg-gray-200 px-2 overflow-auto h-full">
          <div class=" flex flex-col mt-auto">{renderMessages()}</div>
        </div>
        <div class="relative bg-white">
          <input
            type="text"
            name="message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            class="pl-4 pr-16 py-2 border border-blue-700 focus:outline-none w-full"
          />
          <button
            class="absolute right-0 bottom-0 text-blue-600 bg-white  hover:text-blue-500 m-1 
                        px-3 py-1 w-auto transistion-color duration-100 focus:outline-none"
            onClick={(e) => {
              createMessage(e);
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
