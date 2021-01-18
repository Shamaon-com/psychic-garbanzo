import { AuthContext } from "../utils/functionsLib";
import GeneralLayout from "../layouts/generalLayout";
import Chat from "../components/chat";
import Iframe from "../components/iframe";

import React, { useState, useEffect, useContext, useRef } from "react";

import { API, graphqlOperation } from "aws-amplify";
import * as mutations from "../config/graphql/mutations";
import * as queries from "../config/graphql/queries";
import * as subscriptions from "../config/graphql/subscriptions";

import Modal from "../components/modal";
import { useModalFields } from "../utils/hooksLib";

export default function Home(props) {

  const authContext = useContext(AuthContext);

  const [iframe, setIframe] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [fields, handleFieldChange] = useModalFields({
    title: { type: "default", value: "" },
    url: { type: "default", value: "" },
  });

  useEffect(() => {
    onPageRendered();
  }, []);

  const onPageRendered = async () => {
    getIframe();
    subscribeCreateIframe();
  };

  const getIframe = () => {
    API.graphql(graphqlOperation(queries.listIframes)).then((data) => {
      setIframe(data.data.listIframes.items[0]);
    });
  };

  const deleteIframe = (id) => {
    var itemDetails = {
      id: id,
    };
    API.graphql(
      graphqlOperation(mutations.deleteIframe, { input: itemDetails })
    );
    setIframe(null);
  };

  const subscribeCreateIframe = async () => {
    await API.graphql(graphqlOperation(subscriptions.onCreateIframe)).subscribe(
      {
        next: (subonCreateEvent) => {
          setIframe(subonCreateEvent.value.data.onCreateIframe);
        },
      }
    );
  };

  const createIframe = (e) => {
    if (title === "" || src === "") {
      alert("Mensaje vacio");
      return;
    }

    var itemDetails = {
      url: src,
      title: title,
    };

    console.log("Event Details : " + JSON.stringify(itemDetails));
    API.graphql(
      graphqlOperation(mutations.createIframe, { input: itemDetails })
    );
  };

  return (
    <GeneralLayout>
      <Modal
        element={"Evento"}
        fields={fields}
        handleFieldChange={handleFieldChange}
        submit={createIframe}
        showModal={showModal}
        setShowModal={setShowModal}
        isCreating={isCreating}
      />

      <div className="h-mobile flex mx-auto container w-full lg:items-center lg:h-4/5  lg:px-8">
        <div className="flex flex-col mx-auto h-full w-full lg:flex-row">
          <div class="flex flex-col w-full h-full pt-4 lg:pt-8 lg:px-5 lg:h-full lg:w-3/4">
            <div className="text-5x1 lg:text-5xl text-gray-500" style={{height: "10%"}}>
                {iframe.title}
            </div>
            <div className="flex-1 w-full h-full" style={{height: "90%"}}>
              <Iframe src={iframe.url} id={iframe.id}/>
            </div>
          </div>
          <div class="w-full lg:py-10 lg:w-1/4">
            <Chat />
          </div>
        </div>
      </div>
    </GeneralLayout>
  );
}
