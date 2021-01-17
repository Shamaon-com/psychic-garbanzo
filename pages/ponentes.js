import React, { useState, useEffect, useContext } from "react";
import { API, graphqlOperation, Storage } from "aws-amplify";

import GeneralLayout from "../layouts/generalLayout";
import Modal from "../components/modal";
import LazyImage from "../components/lazyImage";
import Grid from "../components/grid";
import {ContainerPage} from "../components/containers";

import * as mutations from "../config/graphql/mutations";
import * as queries from "../config/graphql/queries";
import * as subscriptions from "../config/graphql/subscriptions";

import { AuthContext } from "../utils/functionsLib";
import { useModalFields } from "../utils/hooksLib";


export default function Ponentes() {

  const authContext = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Specifc to page
  const [ponentes, setPonentes] = useState([]);

  const [fields, handleFieldChange] = useModalFields({
    name: { type: "default", value: "" },
    title: { type: "default", value: "" },
    pdf: { type: "file", value: {} },
    image: { type: "file", value: {} }
  });

  useEffect(() => {
    onPageRendered();

  }, []);


  const onPageRendered = async () => {
    getPonentes();
    subscribeCreatePonente();
    subscribeDeletePonente();
  };

  /**
   * GRAPHQL CRUD functions and subscribres
   */
  const subscribeCreatePonente = async () => {
    await API.graphql(
      graphqlOperation(subscriptions.onCreatePonente)
    ).subscribe({
      next: (subonCreatePonente) => {
        setPonentes((ponentes) => [
          ...ponentes,
          subonCreatePonente.value.data.onCreatePonente,
        ]);
      }
    });
  };

  const createPonente = () => {

    var itesmetails = {
      name: fields.name.value,
      title: fields.title.value,
      pdf: fields.pdf.value.name,
      image: fields.image.value.name
    };

    console.log("Ponente Details : " + JSON.stringify(itesmetails));
    API.graphql(
      graphqlOperation(mutations.createPonente, { input: itesmetails })
    );
  };

  const deletePonente = (id) => {
    var itesmetails = {
      id: id,
    };
    API.graphql(
      graphqlOperation(mutations.deletePonente, { input: itesmetails })
    );
  };

  const subscribeDeletePonente = async () => {
    await API.graphql(
      graphqlOperation(subscriptions.onDeletePonente)
    ).subscribe({
      next: (subonDeletePonente) => {
        setPonentes((ponentes) => [
          ...ponentes.filter(
            (event) =>
              event.id != subonDeletePonente.value.data.onDeletePonente.id
          ),
        ]);
      },
    });
  };

  const getPonentes = () => {
    API.graphql(graphqlOperation(queries.listPonentes)).then((data) => {
      setPonentes(data.data.listPonentes.items);
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

      createPonente();
      setIsCreating(false);
      setShowModal(false);
    }
  };




  /**
   * 
   * Render Functions
   */

  const renderPonente = (ponente) => {

    return (
      <div key={ponente.id} className="py-3 px-3 h-96 mx-5 relative sm:mx-0 sm:h-64  bg-blue-50">
        {authContext.isAdmin && (
          <div
            id={ponente.id}
            className="bg-red-500 text-white text-center cursor-pointer z-3 absolute top-0 right-0"
            style={{ width: "30px" }}
            onClick={(e) => {
              deletePonente(e.target.id);
            }}
          >
            -
          </div>
        )}
        <div className="flex justify-center items-center h-2/3">
          <LazyImage s3Key={ponente.image} type="rounded" />
        </div>
        <div className="m-2 h-1/3">
          <h3 className="text-center sm:text-xl text-gray-900 font-medium leading-8">
            {ponente.name}
          </h3>
          <div className="text-center text-gray-400 text-xs font-semibold">
            <p>{ponente.title}</p>
          </div>
          <div className="text-center my-3">
            <a
              className="text-xs text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium"
              href="#"
            >
              View Profile
              </a>
          </div>
        </div>
      </div>
    );
  };


  return (
    <GeneralLayout>
      <ContainerPage>
      <Modal
        element={"Ponente"}
        fields={fields}
        handleFieldChange={handleFieldChange}
        submit={submit}
        showModal={showModal}
        setShowModal={setShowModal}
        isCreating={isCreating}
      />
      <div className="flex flex-row mx-5 sm:mx-0">
        <div className="flex text-xl my-8 sm:text-3xl">Ponentes</div>
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

      <Grid
        array={ponentes}
        renderFunction={renderPonente}
        pcCols={6}
        mobileCols={1}
      />
      </ContainerPage>
    </GeneralLayout>
  );
}
