import React, { useState, useEffect } from 'react';

// Amplify
import { API, graphqlOperation } from "aws-amplify";
import * as subscriptions from "../src/graphql/subscriptions";

// Utils
import { useModalFields } from '../utils/hooksLib';
import {uploadToS3, validate } from '../utils/functionsLib';
import { graphqlGet, graphqlCreate } from "../utils/graphqlOperations";

// Components
import GeneralLayout from '../layouts/generalLayout';
import Modal from '../components/generalComponents/modal';
import FullPage from '../components/containers/fullPage';
import AddButtonAndTitle from '../components/adminComponentes/addButtonAndTitle';
import FileCard from '../components/recursosPage/fileCard';
import VideoCard from '../components/recursosPage/videoCard';
import List  from '../components/containers/list';
import IframeModal from '../components/generalComponents/iframeModal';


export default function Recursos() {

  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Specifc to page
  const [recursos, setRecursos] = useState([]);
  const [iframeSrc, setIframeSrc] = useState(null);

  const [fields, handleFieldChange] = useModalFields({
    name: { type: "default", value: "" },
    text: { type: "default", value: "" },
    videoUrl: { type: "default", value: "" },
    file: { type: "file", value: {} }
  });


  const [currentRecurso, setCurrentRecurso] = useState({});

  const documentType = "document";
  const videoResourceType = "video";


  useEffect(() => {
    graphqlGet("listRecursos", setRecursos);
    subscribeCreateRecurso();
    subscribeDeleteRecurso();

  }, []);


  const subscribeCreateRecurso = async () => {
    await API.graphql(
      graphqlOperation(subscriptions.onCreateRecurso)
    ).subscribe({
      next: (subonCreateRecurso) => {
        setRecursos((recursos) => [
          ...recursos,
          subonCreateRecurso.value.data.onCreateRecurso,
        ]);
      }
    });
  };

  const subscribeDeleteRecurso = async () => {
    await API.graphql(
      graphqlOperation(subscriptions.onDeleteRecurso)
    ).subscribe({
      next: (subonDeleteRecurso) => {
        setRecursos((recursos) => [
          ...recursos.filter(
            (event) =>
              event.id != subonDeleteRecurso.value.data.onDeleteRecurso.id
          ),
        ]);
      },
    });
  };

  const createRecurso = () => {

    var itemDetails = {
      name: fields.name.value,
      type: currentRecurso.type.value,
      file: fields.file.value.name,
      videoUrl: fields.videoUrl.value,
      text: fields.text.value
    };

    console.log(itemDetails);

    graphqlCreate('createRecurso', itemDetails);

  };

  const submit = () => {
    /**
     * This function is trigged when create button is pressed in Modal component,
     * it will create Recurso and upload the correspoing image to s3
     */

    setIsCreating(true);
    if (validate(fields)) {
      if(status.type == videoResourceType){
        for (var field in fields) {
          if (fields[field].type === "file") {
            uploadToS3(fields[field].value);
          }
        }
      }

      createRecurso();
      setIsCreating(false);
      setShowModal(false);
    }
  };

  const generateVideoCardData = () => {

    const videoRecurso = recursos.filter(recurso => recurso.type === videoResourceType);
    return (
      videoRecurso.map((item) => {
        return (
          <VideoCard data={item} setIframeSrc={setIframeSrc} />
        )
      })
    )
  }


  const generateFileCardData = () => {

    const videoRecurso = recursos.filter(recurso => recurso.type === documentType);
    return (
      videoRecurso.map((item) => {
        return (
          <FileCard data={item} setIframeSrc={setIframeSrc} />
        )
      })
    )
  }

  const modifyState = (typeOfRecurso) => {
    if(typeOfRecurso == documentType){
      var diccionario = {type: {type: "disabled", value: documentType}};

      for(let key in fields){
        if(key != "videoUrl"){
          diccionario[key] = fields[key];
        }
      }

      setCurrentRecurso(diccionario);
      setShowModal(true);

    } else if(typeOfRecurso == videoResourceType){
      var diccionario = {type: {type: "disabled", value: videoResourceType}};

      for(let key in fields){
        if(key != "file"){
          diccionario[key] = fields[key];
        }
      }

      setCurrentRecurso(diccionario);
      setShowModal(true);
    }
  }


  return (
    <GeneralLayout>
      <FullPage>
        <Modal
          element={"Recurso"}
          fields={currentRecurso}
          handleFieldChange={handleFieldChange}
          submit={submit}
          showModal={showModal}
          setShowModal={setShowModal}
          isCreating={isCreating}
        />
        <IframeModal
          iframeSrc={iframeSrc}
          setIframeSrc={setIframeSrc}
        />
        <div className="flex flex-col justify-center" style={{ height: "20%" }}>
          <AddButtonAndTitle title={"Recursos"} setShowModal={setShowModal} />
        </div>
        <div 
          className="flex w-10/12 mx-auto h-12 py-2 justify-center border-b-2 border-gray-300 font-bold"
          onClick={() => modifyState(documentType)}
        >
          Documentos
        </div>
        <List data = {generateFileCardData() } />
        <div className="flex w-10/12 mx-auto h-12 py-2 justify-center border-b-2 border-gray-300 font-bold"
        onClick={() => modifyState(videoResourceType)}>
          Videos
        </div>
        <List data = {generateVideoCardData() } />
      </FullPage>
    </GeneralLayout>
  );
}
