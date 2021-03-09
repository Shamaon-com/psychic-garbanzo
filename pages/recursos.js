import React, { useState, useEffect, useContext } from 'react';

// Amplify
import { API, graphqlOperation } from "aws-amplify";
import * as subscriptions from "../src/graphql/subscriptions";

// Utils
import { setDictValue, useModalFields } from '../utils/hooksLib';
import { uploadToS3, validate } from '../utils/functionsLib';
import { graphqlGet, graphqlCreate } from "../utils/graphqlOperations";
import { AuthContext } from "../utils/functionsLib";


// Components
import GeneralLayout from '../layouts/generalLayout';
import Modal from '../components/generalComponents/modal';
import FullPage from '../components/containers/fullPage';
import FileCard from '../components/recursosPage/fileCard';
import VideoCard from '../components/recursosPage/videoCard';
import ComponentList from '../components/containers/list';
import IframeModal from '../components/generalComponents/iframeModal';


export default function Recursos() {

  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUplading, setIsUplading] = useState(false);

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

  const authContext = useContext(AuthContext);
  const generalSettings = authContext.generalSettings[0];

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

  const createDocumentRecurso = async () => {

    setIsCreating(true); setIsUplading(true);

    await uploadToS3(fields.file.value, setIsUplading);

    var itemDetails = {
      name: fields.name.value,
      type: currentRecurso.type.value,
      file: fields.file.value.name,
      videoUrl: fields.videoUrl.value,
      text: fields.text.value
    };

    graphqlCreate('createRecurso', itemDetails);
    setIsCreating(false); setShowModal(false);
  };

  const createVideoRecurso = async () => {

    setIsCreating(true);
    
    var itemDetails = {
      name: fields.name.value,
      type: currentRecurso.type.value,
      file: "",
      videoUrl: fields.videoUrl.value,
      text: fields.text.value
    };

    graphqlCreate('createRecurso', itemDetails);
    setIsCreating(false); setShowModal(false);
  };


  const customValidate = () => {
    /**
     * Validate different fields depending on type defined at
     * currentRecurso.type.value
     */
    if (currentRecurso.type.value === "video"){
      for(let field in fields){
        if(fields[field].value === "" && field !== "file"){
          alert("Rellene todos los campos " + field)
          return
        }
      }
      createVideoRecurso(); 
    } else if (currentRecurso.type.value === "document"){
      for(let field in fields){
        if(fields[field].value === "" && field !== "videoUrl"){
          alert("Rellene todos los campos " + field)
          return
        }
      }
      createDocumentRecurso();
    }
  }



  const generateVideoCardData = () => {

    const videoRecurso = recursos.filter(recurso => recurso.type === videoResourceType);
    return (
      videoRecurso.map((item, index) => {
        return (
          <VideoCard key={index} data={item} setIframeSrc={setIframeSrc} />
        )
      })
    )
  }


  const generateFileCardData = () => {

    const videoRecurso = recursos.filter(recurso => recurso.type === documentType);
    return (
      videoRecurso.map((item, index) => {
        return (
          <FileCard key={index} data={item} setIframeSrc={setIframeSrc} />
        )
      })
    )
  }

  const modifyState = (typeOfRecurso) => {
    if (typeOfRecurso == documentType) {
      var diccionario = { type: { type: "disabled", value: documentType } };

      for (let key in fields) {
        if (key != "videoUrl") {
          diccionario[key] = fields[key];
        }
      }

      setCurrentRecurso(diccionario);
      setShowModal(true);

    } else if (typeOfRecurso == videoResourceType) {
      var diccionario = { type: { type: "disabled", value: videoResourceType } };

      for (let key in fields) {
        if (key != "file") {
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
          submit={customValidate}
          showModal={showModal}
          setShowModal={setShowModal}
          isCreating={isCreating && isUplading}
        />
        <IframeModal
          iframeSrc={iframeSrc}
          setIframeSrc={setIframeSrc}
        />
        <div className="flex flex-col justify-center" style={{ height: "20%" }}>
          <div
            className="text-3xl sm:text-5xl"
            style={{ color: generalSettings.titleColor }}
          >
            Recursos
        </div>
        </div>
        <div
          className="flex flex-row w-full sm:w-8/12 mx-auto h-12 py-2 justify-center border-b-2 border-gray-300 font-bold"
        >
          Documentos

          {authContext.isAdmin &&
            <div
              className="cursor-pointer bg-blue-500 w-6 h-6 text-center ml-2"
              onClick={() => modifyState(documentType)}
            >
              +
            </div>
          }

        </div>
        <ComponentList data={generateFileCardData()} />
        <div className="flex w-full sm:w-8/12 mx-auto h-12 py-2 justify-center border-b-2 border-gray-300 font-bold">
          Videos
          {authContext.isAdmin &&
            <div
              className="cursor-pointer bg-blue-500 w-6 h-6 text-center ml-2"
              onClick={() => modifyState(videoResourceType)}
            >
              +
            </div>
          }

        </div>
        <ComponentList data={generateVideoCardData()} />
      </FullPage>
    </GeneralLayout>
  );
}
