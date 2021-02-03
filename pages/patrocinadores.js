import React, { useState, useEffect, useContext } from "react";
import { API, graphqlOperation, Storage } from "aws-amplify";

import GeneralLayout from "../layouts/generalLayout";
import Modal from "../components/modal";
import LazyImage from "../components/lazyImage";
import Grid from "../components/grid";
import ContainerPage from "../components/containers";

import * as mutations from "../config/graphql/mutations";
import * as queries from "../config/graphql/queries";
import * as subscriptions from "../config/graphql/subscriptions";

import { AuthContext } from "../utils/functionsLib";
import { useModalFields } from "../utils/hooksLib";


export default function Patrocinador() {

  const authContext = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Specifc to page
  const [patrocinadors, setPatrocinadors] = useState([]);
  const [fields, handleFieldChange] = useModalFields({
    name: { type: "default", value: "" },
    url: { type: "default", value: "" },
    image: { type: "file", value: {} }
  });


  useEffect(() => {
    onPageRendered();

  }, []);




  const onPageRendered = async () => {
    getPatrocinadors();
    subscribeCreatePatrocinador();
    subscribeDeletePatrocinador();
  };

  /**
   * GRAPHQL CRUD functions and subscribres
   */
  const subscribeCreatePatrocinador = async () => {
    await API.graphql(
      graphqlOperation(subscriptions.onCreatePatrocinador)
    ).subscribe({
      next: (subonCreatePatrocinador) => {
        setPatrocinadors((patrocinadors) => [
          ...patrocinadors,
          subonCreatePatrocinador.value.data.onCreatePatrocinador,
        ]);
      }
    });
  };

  const createPatrocinador = () => {


    var itesmetails = {
      name: fields.name.value,
      link: fields.url.value,
      file: fields.image.value.name
    };


    API.graphql(
      graphqlOperation(mutations.createPatrocinador, { input: itesmetails })
    );
  };

  const deletePatrocinador = (id) => {
    var itesmetails = {
      id: id,
    };
    API.graphql(
      graphqlOperation(mutations.deletePatrocinador, { input: itesmetails })
    );
  };

  const subscribeDeletePatrocinador = async () => {
    await API.graphql(
      graphqlOperation(subscriptions.onDeletePatrocinador)
    ).subscribe({
      next: (subonDeletePatrocinador) => {
        setPatrocinadors((patrocinadors) => [
          ...patrocinadors.filter(
            (event) =>
              event.id != subonDeletePatrocinador.value.data.onDeletePatrocinador.id
          ),
        ]);
      },
    });
  };

  const getPatrocinadors = () => {
    API.graphql(graphqlOperation(queries.listPatrocinadors)).then((data) => {
      setPatrocinadors(data.data.listPatrocinadors.items)
    });
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
     * it will create ponente and upload the correspoing image to s3
     */
    setIsCreating(true);

    if (validate()) {

      for (var field in fields) {
        if (fields[field].type === "file") {
          console.log(fields[field].value);

          uploadToS3(fields[field].value);

        }
      }

      createPatrocinador();
      setIsCreating(false);
      setShowModal(false);
    }
  };



 


  const renderPatrocinador = (patrocinador) => {
    console.log(patrocinador)
    return (
      <div  className="py-5 px-5 sm:max-w-xs max-h-40 relative">
        {authContext.isAdmin && (
          <div
            id={patrocinador.id}
            className="bg-red-500 text-white text-center cursor-pointer z-3 absolute top-0 right-0 "
            style={{ width: "30px" }}
            onClick={(e) => {
              deletePatrocinador(e.target.id);
            }}
          >
            -
          </div>
        )}
        <a href={patrocinador.link}>
          <div key={patrocinador.id} className="flex justify-center photo-wrapper w-full h-full">
              <LazyImage s3Key={patrocinador.file} />
          </div>
        </a>
      </div>
    );
  };


  return (
    <GeneralLayout>
      <ContainerPage>
      <Modal
        element={"Patrocinador"}
        fields={fields}
        handleFieldChange={handleFieldChange}
        submit={submit}
        showModal={showModal}
        setShowModal={setShowModal}
        isCreating={isCreating}
      />
      <div  className="flex flex-row mx-5 sm:mx-0">
        <div  className="flex text-xl my-8 sm:text-3xl">Patrocinadores</div>
        {authContext.isAdmin && (
          <div  className="flex my-8 sm:text-3xl mx-3">
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

      <Grid
        array={patrocinadors}
        renderFunction={renderPatrocinador}
        pcCols={8}
        mobileCols={1}
      />
      </ContainerPage>
    </GeneralLayout>
  );
}
