import React, { useState, useEffect, useContext } from "react";
import { API, graphqlOperation, Storage } from "aws-amplify";

import GeneralLayout from "../layouts/generalLayout";
import Modal from "../components/modal";
import LazyImage from "../components/lazyImage"
import Grid from "../components/grid";

import { AuthContext } from "../utils/functionsLib";
import { useModalFields } from "../utils/hooksLib";

import * as mutations from "../config/graphql/mutations";
import * as queries from "../config/graphql/queries";
import * as subscriptions from "../config/graphql/subscriptions";




export default function Evento() {

  const authContext = useContext(AuthContext);
  
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Specifc to page
  const [eventos, setEventos] = useState([]);


  const [fields, handleFieldChange] = useModalFields({
    name: {type: "default", value: ""},
    title: {type: "default", value: ""},
    type: {
      type: "select", 
      options: [
        {"key": 1, "text": "solo Streaming"}, 
        {"key": 2, "text": "Streaming y chat"},
        {"key": 3, "text": "Streaming y preguntas"}
      ]},
    startDate: {type: "date", value: ""},
    endDate: {type: "date", value: ""}
  });

  useEffect(() => {
    onPageRendered();
  }, []);





  const onPageRendered = async () => {
    getEventos();
    subscribeCreateEvento();
    subscribeDeleteEvento();
  };

  /**
   * GRAPHQL CRUD functions and subscribres
   */
  const subscribeCreateEvento = async () => {
    await API.graphql(
      graphqlOperation(subscriptions.onCreateEvento)
    ).subscribe({
      next: (subonCreateEvento) => {
        setEventos((eventos) => [
          ...eventos,
          subonCreateEvento.value.data.onCreateEvento,
        ]);
      }
    });
  };

  const createEvento = () => {
    const filename = fields.name + "_" + fields.image[0].name;

    var itesmetails = {
      name: fields.name,
      link: fields.link,
      file: filename.replace(/\s+/g, '')
    };

    API.graphql(
      graphqlOperation(mutations.createEvento, { input: itesmetails })
    );
  };

  const deleteEvento = (id) => {
    var itesmetails = {
      id: id,
    };
    API.graphql(
      graphqlOperation(mutations.deleteEvento, { input: itesmetails })
    );
  };

  const subscribeDeleteEvento = async () => {
    await API.graphql(
      graphqlOperation(subscriptions.onDeleteEvento)
    ).subscribe({
      next: (subonDeleteEvento) => {
        setEventos((eventos) => [
          ...eventos.filter(
            (event) =>
              event.id != subonDeleteEvento.value.data.onDeleteEvento.id
          ),
        ]);
      },
    });
  };

  const getEventos = () => {
    API.graphql(graphqlOperation(queries.listEventos)).then((data) => {
  
      if(authContext.isAdmin){
      
        setEventos([{id: "admin"}, ...data.data.listEventos.items]);
      }else{
        setEventos(data.data.listEventos.items)
      }
    }
    );
  };


  /**
   * UI Operation functions
   */

  const validate = () => {
    for (var field in fields) {
      if (fields[field] === "") {
        alert("Rellene todos los campos");
        return false;
      }
    }
    return true;
  };

  const submit = () => {
    /**
     * This function is trigged when create button is pressed in Modal component,
     * it will create evento and upload the correspoing image to s3
     */
    setIsCreating(true);

    if (!validate()) {
      return;
    }

    const file = fields.image[0];
    const filename = fields.name + "_" + file.name;

    Storage.put(filename.replace(/\s+/g, ''), file, {
      contentType: "image/png",
    })
      .then((result) => {
        
        createEvento();
        setIsCreating(false);
        setShowModal(false);
      })
      .catch((err) => {alert(err); isCreating(false)});
  };


  /**
   * 
   * Render Functions
   */

  const renderEvento = (evento) => {
    
    return (
      <div class="py-5 px-5 sm:max-w-xs max-h-40 relative">
        {authContext.isAdmin && (
          <div
            id={evento.id}
            class="bg-red-500 text-white text-center cursor-pointer z-3 absolute top-0 right-0 "
            style={{ width: "30px" }}
            onClick={(e) => {
              deleteEvento(e.target.id);
            }}
          >
            -
          </div>
        )}
        <a href={evento.link}>
          <div class="photo-wrapper w-full h-full">
              <LazyImage s3Key={evento.file} />
          </div>
        </a>
      </div>
    );
  };


  return (
    <GeneralLayout authContext={authContext}>
      <Modal
        element={"Evento"}
        fields={fields}
        handleFieldChange={handleFieldChange}
        submit={submit}
        showModal={showModal}
        setShowModal={setShowModal}
        isCreating={isCreating}
      />
      <Grid
        array={eventos.map((evento) => {
          return renderEvento(evento);
        })}
      />
      {authContext.isAdmin && (
        <div
          class="w-full h-24 border-dashed flex border-gray-400 border-2 
                cursor-pointer justify-center text-gray-500
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
    </GeneralLayout>
  );
}
