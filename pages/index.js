import React, { useState, useEffect } from 'react';

// Amplify
import { API, graphqlOperation } from "aws-amplify";
import * as subscriptions from "../src/graphql/subscriptions";

// Utils
import { useModalFields } from '../utils/hooksLib';
import { uploadToS3, validate } from '../utils/functionsLib';
import { graphqlGet, graphqlCreate } from "../utils/graphqlOperations";

// Components
import GeneralLayout from '../layouts/generalLayout';
import Modal from '../components/generalComponents/modal';
import FullPage from '../components/containers/fullPage';
import AddButtonAndTitle from '../components/adminComponentes/addButtonAndTitle';
import EventoCard from '../components/eventoPage/eventoCard';
import Grid from '../components/containers/grid';



const Eventos = () => {

  /*

      url: String!
    title: String!
    startDate: String!
    endDate: String!
    Chat: Boolean!
    Questions: Boolean!
    Allowed: Boolean!

    */
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Specifc to page 
  const [eventos, setEventos] = useState([]);

  const [fields, handleFieldChange] = useModalFields({
    iframe: { type: "default", value: "" },
    titulo: { type: "default", value: "" },
    chat: {
      type: "select", value: "",
      options: [
        { key: false, text: "Desactivado" },
        { key: true, text: "Ativado" },
      ]
    },
    preguntas: {
      type: "select", value: "",
      options: [
        { key: false, text: "Desactivado" },
        { key: true, text: "Ativado" },
      ]
    },
    inicio: { type: "date", value: { day: 0, month: 0, hour: 0, minute: 0 }},
    fin: { type: "date", value: { day: 0, month: 0, hour: 0, minute: 0 }},
    image: { type: "file", value: {} }
  });

  useEffect(() => {
    graphqlGet("listEventos", setEventos);
    subscribeCreateEvento();
    subscribeDeleteEvento();

  }, []);


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


  const createEvento = () => {

    var itemDetails = {
      url: fields.iframe.value,
      title: fields.titulo.value,
      chat: fields.chat.value,
      questions: fields.preguntas.value,
      allowed: false,
      startDate: new Date(
        2020,
        fields.inicio.value.month,
        fields.inicio.value.day,
        fields.inicio.value.hour,
        fields.inicio.value.minute
      ).toString(),
      endDate: new Date(
        2020,
        fields.fin.value.month,
        fields.fin.value.day,
        fields.fin.value.hour,
        fields.fin.value.minute
      ).toString(),
      image: fields.image.value.name
    };

    graphqlCreate('createEvento', itemDetails);
  };

  const submit = () => {
    /**
     * This function is trigged when create button is pressed in Modal component,
     * it will create evento and upload the correspoing image to s3
     */
    setIsCreating(true);

    if (validate()) {
      for (var field in fields) {
        if (fields[field].type === "file") {
          uploadToS3(fields[field].value);
        }
      }

      createEvento();
      setIsCreating(false);
      setShowModal(false);
    }
  };



  const generateData = () => {
    console.log(eventos)
    return (
      eventos.map((evento) => {
        return (
          <EventoCard data={evento} />
        )
      })
    )
  }


  return (
    <FullPage>
      <Modal
        element={"Evento"}
        fields={fields}
        handleFieldChange={handleFieldChange}
        submit={submit}
        showModal={showModal}
        setShowModal={setShowModal}
        isCreating={isCreating}
      />
      <div className="flex flex-col justify-center " style={{ height: "20%" }}>
        <AddButtonAndTitle title={"Eventos"} setShowModal={setShowModal} />
      </div>
      <div style={{ height: "80%"}}>
        <Grid
          data={generateData()}
          pcCols={4}
          mobileCols={2}
        />
      </div>
    </FullPage>
  );
}

Eventos.layout = GeneralLayout;

export default Eventos;
