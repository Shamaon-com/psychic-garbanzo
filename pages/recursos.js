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


export default function Recursos() {

  const authContext = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Specifc to page
  const [recursos, setRecursos] = useState([]);

  const [fields, handleFieldChange] = useModalFields({
    type: { type: "select", value: "", options: [{key: 1, text: "one"}, {key:2, text: "two"}]},
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
      title: fields.title.value,
      pdf: fields.pdf.value.name,
      image: fields.image.value.name
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

  const renderRecurso = (Recurso) => {

    return (
      <div>
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

      </ContainerPage>
    </GeneralLayout>
  );
}
