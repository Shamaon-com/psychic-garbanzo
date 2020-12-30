import React, { useState, useEffect, useContext } from "react";
import { API, graphqlOperation } from "aws-amplify";
import * as mutations from "../config/graphql/mutations";
import * as queries from "../config/graphql/queries";
import * as subscriptions from "../config/graphql/subscriptions";



export default function Chat({ ...props }) {


    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([])

    useEffect(() => {
        onPageRendered();

      }, []);



    const onPageRendered = async () => {
        getMessages();
        subscribeCreateMessage();
      };

      const sortArray = (array) => {
        return array.sort(function (a, b) {
            var c = new Date(a.createdAt);
            var d = new Date(b.createdAt);
            return c - d;
          });
    }

    
    const subscribeCreateMessage = async () => {
        await API.graphql(graphqlOperation(subscriptions.onCreateMessage)).subscribe({
            next: (subonCreateEvent) => {
                setMessages((messages) => sortArray([
                    ...messages,
                    subonCreateEvent.value.data.onCreateMessage,
                  ]));
            }
        });
    };

    const getMessages = () => {
        API.graphql(graphqlOperation(queries.listMessages)).then((data) =>         
            setMessages(sortArray(data.data.listMessages.items))
        );
    };

    const createMessage = (e) => {

        if(message === ""){
            alert("Mensaje vacio");
            return;
        }

        var itemDetails = {
          user: props.user,
          message: message
        };
    
        console.log("Event Details : " + JSON.stringify(itemDetails));
        API.graphql(
          graphqlOperation(mutations.createMessage, { input: itemDetails })
        );
        setMessage("");
        console.log(messages)
      };

    const renderMessages = () => {
        return (
            messages.map((message, key) => {
                if(message.user === props.user){
                    return(
                        <div id={message.id} class=" bg-white text-gray-700 p-2 self-start my-2 rounded-md shadow mr-3">
                            <div class="text-sm">
                                {message.user.split('@')[0]} - {new Date(message.createdAt).toLocaleTimeString()}
                            </div>
                            {message.message}
                        </div>
                    )
                }else{
                    return(                        
                        <div id={message.id} class=" bg-green-500 text-white p-2 self-end my-2 rounded-md shadow ml-3">
                                {message.message}
                        </div>
                    )
                }
            })
        )
    }

    return (
        <div class="flex flex-col items-end w-full h-full py-10">
            <div class="chat-modal flex flex-col w-full h-full border-8 border-gray-400">
               <div class="flex justify-between items-center text-white p-1 bg-gray-500 shadow-lg mr-5 w-full">
                     <div class="flex items-center">
                        <h2 class="font-semibold tracking-wider">Chat</h2>
                    </div>
                </div>
                <div class="flex flex-col bg-gray-200 px-2 overflow-auto h-full">
                    <div class=" flex flex-col mt-auto">
                    {renderMessages()}
                    </div>
                    
                </div>
                <div class="relative bg-white">
                <input type="text" name="message" value={message}                
                        onChange={(e) => {
                            setMessage(e.target.value);
                        }}
                        class="pl-4 pr-16 py-2 border border-blue-700 focus:outline-none w-full"/>
          <button class="absolute right-0 bottom-0 text-blue-600 bg-white  hover:text-blue-500 m-1 
                        px-3 py-1 w-auto transistion-color duration-100 focus:outline-none"
                    onClick={(e)=> {
                        createMessage(e);
                    }}
          >Send</button>
      </div>
    </div>
  </div>
    )
}

