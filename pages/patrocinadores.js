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
import PatrocinadorsCard from '../components/PatrocinadoresPage/patrocinadorCard';
import Grid from '../components/containers/grid';


export default function Patrocinador() {


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
    graphqlGet("listPatrocinadors", setPatrocinadors);
    subscribeCreatePatrocinador();
    subscribeDeletePatrocinador();

  }, []);


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

  const createPatrocinador = () => {
    var itemDetails = {
      name: fields.name.value,
      link: fields.url.value,
      file: fields.image.value.name
    };

    graphqlCreate('createPatrocinador', itemDetails);
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
      createPatrocinador();
      setIsCreating(false);
      setShowModal(false);
    }
  };



  const generateData = () => {
    return (
      patrocinadors.map((item) => {
        return (
          <PatrocinadorsCard data={item} />
        )
      })
    )
  }

  return (
    <GeneralLayout>
      <FullPage>
      <Modal
        element={"Patrocinador"}
        fields={fields}
        handleFieldChange={handleFieldChange}
        submit={submit}
        showModal={showModal}
        setShowModal={setShowModal}
        isCreating={isCreating}
      />
      <div className="flex flex-col justify-center" style={{ height: "20%" }}>
        <AddButtonAndTitle title={"Patrocinadores"} setShowModal={setShowModal} />
      </div>
      <Grid
        data={ generateData() }
        pcCols={6}
        mobileCols={4}
      />
      </FullPage>
    </GeneralLayout>
  );
}
