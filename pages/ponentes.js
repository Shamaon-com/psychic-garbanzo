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
import PonenteCard from '../components/ponentePage/ponenteCard';
import Grid from '../components/containers/grid';



export default function Ponentes() {

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
    graphqlGet("listPonentes", setPonentes);
    subscribeCreatePonente();
    subscribeDeletePonente();

  }, []);


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


  const createPonente = () => {

    var itemDetails = {
      name: fields.name.value,
      title: fields.title.value,
      pdf: fields.pdf.value.name,
      image: fields.image.value.name
    };

    graphqlCreate('createPonente', itemDetails);
  };

  const submit = () => {
    /**
     * This function is trigged when create button is pressed in Modal component,
     * it will create ponente and upload the correspoing image to s3
     */
    setIsCreating(true);

    if (validate()) {
      for (var field in fields) {
        if (fields[field].type === "file") {
          uploadToS3(fields[field].value);
        }
      }

      createPonente();
      setIsCreating(false);
      setShowModal(false);
    }
  };



  const generateData = () => {
    return (
      ponentes.map((ponente) => {
        return (
          <PonenteCard data={ponente} />
        )
      })
    )
  }


  return (
    <GeneralLayout>
      <FullPage>
        <Modal
          element={"Ponente"}
          fields={fields}
          handleFieldChange={handleFieldChange}
          submit={submit}
          showModal={showModal}
          setShowModal={setShowModal}
          isCreating={isCreating}
        />
        <div className="flex flex-col justify-center" style={{ height: "20%" }}>
          <AddButtonAndTitle title={"Ponentes"} setShowModal={setShowModal} />
        </div>
        <Grid
          data={ generateData() }
          pcCols={6}
          mobileCols={1}
        />
      </FullPage>
    </GeneralLayout>
  );
}
