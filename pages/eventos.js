import GeneralLayout from "../layouts/generalLayout";
import Modal from "../components/modal";
import React, { useState, useEffect, useContext } from "react";
import { API, graphqlOperation, Storage } from "aws-amplify";
import * as mutations from "../config/graphql/mutations";
import * as queries from "../config/graphql/queries";
import * as subscriptions from "../config/graphql/subscriptions";
import { AuthContext } from "../utils/functionsLib";
import { useModalFields } from "../utils/hooksLib";
import LazyImage from "../components/lazyImage"


export default function Evento() {

  const authContext = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Specifc to page
  const [eventos, setEventos] = useState([]);
  const [index, setIndex] = useState(0);
  const mobileCols = 1
  const pcCols = 2
  const [numberOfElements, setNumberOfElements] = useState(mobileCols)

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
    if (authContext.userGroup) {
      if (authContext.userGroup.includes("admins")) {
        setIsAdmin(true)
      }
    }
  }, []);


  useEffect(() => {
    handleResize();
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
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
  
      if(authContext.userGroup.includes("admins")){
      
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

  const moveInGrid = (e) => {
    if (e.target.id === "forward") {
      setIndex(calculateStopIndex())
    }
    if (e.target.id === "backwards") {
      setIndex(index - numberOfElements)
    }
  }

  const handleResize = () => {

    if (window.screen.width >= 640) {
      setNumberOfElements(pcCols)
      setIndex(0)
    } else {
      setNumberOfElements(mobileCols)
      setIndex(0)
    }
  }

  const calculateStopIndex = () => {

    if (index < index + numberOfElements && index + numberOfElements < eventos.length) {
      return index + numberOfElements;
    }
    else {
      return eventos.length;
    }
  }


  /**
   * 
   * Render Functions
   */

  const renderGrid = () => {


    var secondaryEventos = eventos;
    var stopIndex = calculateStopIndex();
    secondaryEventos = secondaryEventos.slice(index, stopIndex);

  
    var dataArray = secondaryEventos.map((evento, key) => {
      if (evento.id === "admin") {
        return renderCreateEventoUi();
      }
        return renderEvento(evento);
    })

    return (
      <div class="mt-20 mb-auto w-full">
        <div class=" sm:grid sm:grid-cols-2 gap-6 auto-rows-max">
          {dataArray}
        </div>
        <div class="flex flex-row justify-center my-5">
          {index !== 0 &&
            <div id="backwards" class="mx-2 cursor-pointer bg-gray-400 w-12 text-center text-white" onClick={moveInGrid}>
              &lt;
          </div>
          }
          {index + numberOfElements < eventos.length &&
            <div id="forward" class="mx-2 cursor-pointer bg-gray-500 w-12 text-center text-white" onClick={moveInGrid}>
              &gt;
          </div>
          }
        </div>
      </div>
    )
  }

  const renderCreateEventoUi = () => {
    return (
      <div class="border-dashed  h-60 border-gray-400 border-2 cursor-pointer text-gray-500
       hover:bg-gray-400 hover:text-white py-3"

        onClick={(e) => {
          setShowModal(true);
        }}
      >
        <div class="p-2">
          <h3 class="text-center text-xl font-medium leading-8">
            Añadir
          </h3>
        </div>
      </div>
    );
  }

  const renderEvento = (evento) => {
    
    return (
      <div class="py-5 px-5 sm:max-w-xs max-h-40 relative">
        {isAdmin && (
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
      <div class="max-w-5xl mx-auto w-full h-full">
        <div class="flex flex-wrap justify-center h-full">
          {renderGrid()}
        </div>
      </div>
    </GeneralLayout>
  );
}
