import React, { useState, useEffect, useContext } from "react";
import { API, graphqlOperation, Storage } from "aws-amplify";

import GeneralLayout from "../layouts/generalLayout";
import Modal from "../components/modal";
import IframeModal from "../components/iframeModal";
import ContainerPage from "../components/containers";
import { icon, videoIcon } from "../utils/svg";

import * as mutations from "../config/graphql/mutations";
import * as queries from "../config/graphql/queries";
import * as subscriptions from "../config/graphql/subscriptions";

import { AuthContext } from "../utils/functionsLib";
import { useModalFields } from "../utils/hooksLib";


export default function Recursos() {

  const authContext = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Specifc to page
  const [recursos, setRecursos] = useState([]);
  const [iframeSrc, setIframeSrc] = useState(null);

  const [fields, handleFieldChange] = useModalFields({
    type: { type: "select", value: "document", options: [{ key: "document", text: "Documentos" }, { key: "video", text: "Video" }] },
    name: { type: "default", value: "" },
    text: { type: "default", value: "" },
    videoUrl: { type: "default", value: "" },
    file: { type: "file", value: {} }

  });

  useEffect(() => {
    onPageRendered();

  }, []);


  const onPageRendered = async () => {
    getRecursos();
    subscribeCreateRecurso();
    subscribeDeleteRecurso();
  };

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

  const createRecurso = () => {

    var itesmetails = {
      name: fields.name.value,
      type: fields.type.value,
      file: fields.file.value.name,
      videoUrl: fields.videoUrl.value,
      text: fields.text.value
    };

    console.log("Recurso Details : " + JSON.stringify(itesmetails));
    API.graphql(
      graphqlOperation(mutations.createRecurso, { input: itesmetails })
    );
  };

  const deleteRecurso = (id) => {
    var itesmetails = {
      id: id,
    };
    API.graphql(
      graphqlOperation(mutations.deleteRecurso, { input: itesmetails })
    );
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

  // list
  const getRecursos = () => {
    API.graphql(graphqlOperation(queries.listRecursos)).then((data) => {
      setRecursos(data.data.listRecursos.items);
    }
    );
  };


  /**
   * UI Operation functions
   */

  const validate = () => {
    for (var field in fields) {
      if (fields[field] === "" && field !== "videoUrl") {
        alert("Rellene todos los campos");
        return false;
      }
    }
    return true;
  };

  const uploadToS3 = async (file) => {

    Storage.put(file.name.replace(/\s+/g, ''), file, {
      contentType: file.type,
    }).then((result) => {
      console.log(result);
    }).catch((err) => {
      alert(err);
    })
  }



  const submit = () => {
    /**
     * This function is trigged when create button is pressed in Modal component,
     * it will create Recurso and upload the correspoing image to s3
     */
    setIsCreating(true);

    if (validate()) {

      for (var field in fields) {
        if (fields[field].type === "file") {
          console.log(fields[field].value);

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

  const renderRecurso = () => {

    const documnetRecurso = recursos.filter(recurso => recurso.type === "document");

    const videoRecurso = recursos.filter(recurso => recurso.type === "video");


    return (
      <div className="flex flex-col w-full max-w-2xl mx-auto">
        <div className="w-full bg-gray-100 shadow">
          <div className="flex w-full h-12 py-2 justify-center border-b-2 border-gray-300 font-bold">
            Documentos
          </div>
          {documnetRecurso.map((recurso, index) => {
            return (
              <div className="flex w-full flex-row h-20 relative">
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
                <div className="flex flex-col w-1/6 h-full justify-center items-center">
                  <a href="http://www.google.com">
                    {icon()}
                  </a>
                </div>
                <div className="flex flex-col w-5/6 justify-center align-center">
                  <div className="mb-1 text-blue-700">
                    {recurso.name}
                  </div>
                  {recurso.text}
                </div>
              </div>
            )
          })}
        </div>
        <div className="w-full bg-gray-100 shadow mt-5">
          <div className="flex w-full h-12 py-2 justify-center border-b-2 border-gray-300 font-bold">
            Videos
                    </div>
          {videoRecurso.map((recurso, index) => {
            return (
              <div className="flex w-full flex-row h-20 relative">
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
                <div className="flex flex-col w-1/6 h-full justify-center items-center">
                  <div onClick={(e) => setIframeSrc(recurso.videoUrl)}>
                    {videoIcon()}
                  </div>
                </div>
                <div className="flex flex-col w-5/6 justify-center align-center">
                  <div className="mb-1 text-blue-700">
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


  return (
    <GeneralLayout>
      <ContainerPage>
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
        <div className="flex flex-row mx-5 sm:mx-0">
          <div className="flex text-xl my-8 sm:text-3xl">Recursos</div>
          {authContext.isAdmin && (
            <div className="flex my-8 sm:text-3xl mx-3">
              <div
                className="bg-blue-500 text-white text-center cursor-pointer"
                style={{ width: "40px" }}
                onClick={(e) => {
                  setShowModal(true);
                }}
              >
                +
            </div>
            </div>
          )}
        </div>
        {renderRecurso()}
      </ContainerPage>
    </GeneralLayout>
  );
}
