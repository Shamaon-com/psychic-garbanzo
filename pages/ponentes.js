import GeneralLayout from "../layouts/generalLayout";
import Modal from "../components/modal";
import React, { useState, useEffect, useContext } from "react";
import { API, graphqlOperation, Storage } from "aws-amplify";
import * as mutations from "../config/graphql/mutations";
import * as queries from "../config/graphql/queries";
import * as subscriptions from "../config/graphql/subscriptions";
import { AuthContext } from "../utils/functionsLib";

import { useFormFields } from "../utils/hooksLib";

export default function Ponentes(props) {
  const authContext = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [ponentes, setPonentes] = useState([]);
  const [index, setIndex] = useState(0);

  const [fields, handleFieldChange] = useFormFields({
    name: "",
    title: "",
    image: "",
  });

  useEffect(() => {
    onPageRendered();
    if (authContext.userGroup) {
      setIsAdmin(authContext.userGroup.includes("admins"));
    }
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
      },
    });
  };

  const createPonente = () => {
    const filename = fields.name + "_" + file.name;

    var itemDetails = {
      name: fields.name,
      title: fields.title,
      image: filename.replace(/\s+/g, '')
    };

    console.log("Ponente Details : " + JSON.stringify(itemDetails));
    API.graphql(
      graphqlOperation(mutations.createPonente, { input: itemDetails })
    );
  };

  const deletePonente = (id) => {
    var itemDetails = {
      id: id,
    };
    API.graphql(
      graphqlOperation(mutations.deletePonente, { input: itemDetails })
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
    API.graphql(graphqlOperation(queries.listPonentes)).then((data) =>
      setPonentes(data.data.listPonentes.items)
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

  const submit = () => {
    if (!validate()) {
      return;
    }

    const file = fields.image[0];
    const filename = fields.name + "_" + file.name;

    Storage.put(filename.replace(/\s+/g, ''), file, {
      contentType: "image/png",
    })
      .then((result) => {
        console.log(result);
        createPonente();
      })
      .catch((err) => console.log(err));
  };


  /**
   * 
   * Render Functions
   */

  const renderGrid = () => {

    const dataArray = []
    var stopIndex;

    if(index < index + 5 && index + 5 < ponentes.length){
      stopIndex = index + 5
    }
    else{
      stopIndex = ponentes.length;
    }
    
    var aux = index;
    while(aux <= stopIndex){
      console.log(aux, stopIndex, ponentes.length)
      if(isAdmin && aux % 5 == 0){
        dataArray.push(renderCreatePonenteUi())
      }else{
        dataArray.push(renderPonente(index))
      }
      aux++; 
    }

    return dataArray;
  }

  const renderCreatePonenteUi = () => {
    return (
      <div class="bg-blue-50  py-3 px-3 max-w-xs"
        onClick={(e) => {
          setShowModal(true);
        }}
      >
        <div class="photo-wrapper p-2">
          <img
            class="w-32 h-32 rounded-full mx-auto"
            src="https://www.gravatar.com/avatar/2acfb745ecf9d4dccb3364752d17f65f?s=260&d=mp"
            alt="John Doe"
          />
        </div>
        <div class="p-2">
          <h3 class="text-center text-xl text-gray-900 font-medium leading-8">
            Añadir
          </h3>
        </div>
      </div>
  );
  }

  const renderPonente = () => {
    return (
      <div class="w-1/3 overflow-hidden sm:w-1/2 md:w-1/3 lg:w-1/3 justify-center">
        <div class="bg-blue-50  py-3 px-3 max-w-xs">
          <div class="photo-wrapper p-2">
            <img
              class="w-32 h-32 rounded-full mx-auto"
              src="https://www.gravatar.com/avatar/2acfb745ecf9d4dccb3364752d17f65f?s=260&d=mp"
              alt="John Doe"
            />
          </div>
          <div class="p-2">
            <h3 class="text-center text-xl text-gray-900 font-medium leading-8">
              Joh Doe
            </h3>
            <div class="text-center text-gray-400 text-xs font-semibold">
              <p>Web Developer</p>
            </div>
            <div class="text-center my-3">
              <a
                class="text-xs text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium"
                href="#"
              >
                View Profile
              </a>
            </div>
          </div>
        </div>
        </div>
    );
  };
  

  return (
    <GeneralLayout authContext={authContext}>
      <Modal
        fields={fields}
        handleFieldChange={handleFieldChange}
        submit={submit}
        showModal={showModal}
        setShowModal={setShowModal}
      />
      <div class="max-w-5xl mx-auto w-full">
        <div class="flex flex-wrap overflow-hidden">
          {renderGrid()}
        </div>
      </div>
    </GeneralLayout>
  );
}
