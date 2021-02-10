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
import List  from '../components/containers/list';
import IframeModal from '../components/generalComponents/iframeModal';

export default function Recursos() {

  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Specifc to page
  const [recursos, setRecursos] = useState([]);
  const [iframeSrc, setIframeSrc] = useState(null);

  const [fields, handleFieldChange] = useModalFields({
    type: { 
      type: "select", value: "document",
       options: [
        { key: "document", text: "Documentos" }, 
        { key: "video", text: "Video" }
      ] 
    },
    name: { type: "default", value: "" },
    text: { type: "default", value: "" },
    videoUrl: { type: "default", value: "" },
    file: { type: "file", value: {} }

  });

  useEffect(() => {
    graphqlGet("listRecursos", setRecursos);
    subscribeCreateRecurso();
    subscribeDeleteRecurso();

  }, []);

  /**
   * GRAPHQL CRUD functions and subscribres
   */

  const subscribeCreateRecurso = async () => {
    await API.graphql(
      graphqlOperation(subscriptions.onCreateRecurso)
    ).subscribe({
      next: (subonCreateRecurso) => {
        console.log(subonCreateRecurso.value.data.onCreateRecurso)
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
      type: fields.type.value,
      file: fields.file.value.name,
      videoUrl: fields.videoUrl.value,
      text: fields.text.value
    };

    graphqlCreate('createRecursos', itemDetails);

  };

  const submit = () => {
    /**
     * This function is trigged when create button is pressed in Modal component,
     * it will create Recurso and upload the correspoing image to s3
     */
    setIsCreating(true);
    if (validate()) {
      for (var field in fields) {
        if (fields[field].type === "file") {
          uploadToS3(fields[field].value);
        }
      }

      createRecurso();
      setIsCreating(false);
      setShowModal(false);
    }
  };




  /**
   * 
   * Render Functions
   */


  const generateFileCardData = () => {

    const videoRecurso = recursos.filter(recurso => recurso.type === "video");


    return (
      videoRecurso.map((item) => {
        return (
          <FileCard data={item} setIframeSrc={setIframeSrc} />
        )
      })
    )
  }

  /*
  const renderRecurso = () => {

    const documnetRecurso = recursos.filter(recurso => recurso.type === "document");

    const videoRecurso = recursos.filter(recurso => recurso.type === "video");


    return (
      <div  className="flex flex-col w-full max-w-2xl mx-auto">
        <div  className="w-full bg-gray-100 shadow">
          <div  className="flex w-full h-12 py-2 justify-center border-b-2 border-gray-300 font-bold">
            Documentos
          </div>
          {documnetRecurso.map((recurso, index) => {
            return (
              <div  className="flex w-full flex-row h-20 relative">
                {authContext.isAdmin && (
                  <div
                    id={recurso.id}
                     className="bg-red-500 text-white text-center cursor-pointer z-3 absolute top-0 right-0 "
                    style={{ width: "30px" }}
                    onClick={(e) => {
                      deleteRecurso(e.target.id);
                    }}
                  >
                    -
                  </div>
                )}
                <div  className="flex flex-col w-1/6 h-full justify-center items-center">
                  <a href="http://www.google.com">
                    {icon()}
                  </a>
                </div>
                <div  className="flex flex-col w-5/6 justify-center align-center">
                  <div  className="mb-1 text-blue-700">
                    {recurso.name}
                  </div>
                  {recurso.text}
                </div>
              </div>
            )
          })}
        </div>
        <div  className="w-full bg-gray-100 shadow mt-5">
          <div  className="flex w-full h-12 py-2 justify-center border-b-2 border-gray-300 font-bold">
            Videos
                    </div>
          {videoRecurso.map((recurso, index) => {
            return (
              <div  className="flex w-full flex-row h-20 relative">
                {authContext.isAdmin && (
                  <div
                    id={recurso.id}
                     className="bg-red-500 text-white text-center cursor-pointer z-3 absolute top-0 right-0 "
                    style={{ width: "30px" }}
                    onClick={(e) => {
                      deleteRecurso(e.target.id);
                    }}
                  >
                    -
                  </div>
                )}
                <div  className="flex flex-col w-1/6 h-full justify-center items-center">
                  <div onClick={(e) => setIframeSrc(recurso.videoUrl)}>
                    {videoIcon()}
                  </div>
                </div>
                <div  className="flex flex-col w-5/6 justify-center align-center">
                  <div  className="mb-1 text-blue-700">
                    {recurso.name}
                  </div>
                  {recurso.text}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    );
  };
  */

  return (
    <GeneralLayout>
      <FullPage>
        <Modal
          element={"Recurso"}
          fields={fields}
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
          <AddButtonAndTitle title={"Ponente"} setShowModal={setShowModal} />
        </div>
        <List data = {generateFileCardData() } />
      </FullPage>
    </GeneralLayout>
  );
}
