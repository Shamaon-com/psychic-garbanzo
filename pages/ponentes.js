import GeneralLayout from "../layouts/generalLayout";
import Modal from "../components/modal";
import React, { useState, useEffect, useContext } from "react";
import { API, graphqlOperation, Storage } from "aws-amplify";
import * as mutations from "../config/graphql/mutations";
import * as queries from "../config/graphql/queries";
import * as subscriptions from "../config/graphql/subscriptions";
import { AuthContext } from "../utils/functionsLib";
import { useFormFields } from "../utils/hooksLib";
import Image from 'next/image';


export default function Ponentes() {

  const authContext = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Specifc to page
  const [ponentes, setPonentes] = useState([]);
  const [imageDict, setimageDict] = useState({});
  const [index, setIndex] = useState(0);
  const [numberOfElements, setNumberOfElements] = useState(1)
  const [fields, handleFieldChange] = useFormFields({
    name: "",
    title: "",
    url: "",
    image: ""
  });

  useEffect(() => {
    onPageRendered();
    if (authContext.userGroup) {
      if (authContext.userGroup.includes("admins")) {
        setIsAdmin(true)

      }
    }

  }, []);


  useEffect(() => {
    handleResize();
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
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
        getImage(subonCreatePonente.value.data.onCreatePonente.id, subonCreatePonente.value.data.onCreatePonente.file)
      },
    });
  };

  const createPonente = () => {
    const filename = fields.name + "_" + fields.image[0].name;

    var itesmetails = {
      name: fields.name,
      title: fields.title,
      url: fields.url,
      file: filename.replace(/\s+/g, '')
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

      if(authContext.userGroup.includes("admins")){
        setPonentes([{id: "admin"}, ...data.data.listPonentes.items]);
      }else{
        setPonentes(data.data.listPonentes.items)
      }
      data.data.listPonentes.items.map((item) => {
        getImage(item.id, item.file);
      })
    }
    );
  };

  async function getImage(index, key) {
  
    Storage.get(key).then((data) =>{
      let intDIct = imageDict
      intDIct[index] = data
      setimageDict({...intDIct})

    })


  }

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
    /**
     * This function is trigged when create button is pressed in Modal component,
     * it will create ponente and upload the correspoing image to s3
     */
    setIsCreating(true);

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
        setIsCreating(false);
        setShowModal(false);
      })
      .catch((err) => {alert(err); isCreating(false)});
  };

  const moveInGrid = (e) => {
    if (e.target.id === "forward") {
      setIndex(calculateStopIndex())
    }
    if (e.target.id === "backwards") {
      setIndex(index - numberOfElements)
    }
  }

  const handleResize = () => {

    if (window.screen.width >= 640) {
      setNumberOfElements(8)
      setIndex(0)
    } else {
      setNumberOfElements(1)
      setIndex(0)
    }
  }

  const calculateStopIndex = () => {

    if (index < index + numberOfElements && index + numberOfElements < ponentes.length) {
      return index + numberOfElements;
    }
    else {
      return ponentes.length;
    }
  }


  /**
   * 
   * Render Functions
   */

  const renderGrid = () => {

    var secondaryPonentes = ponentes;
    var stopIndex = calculateStopIndex();
    secondaryPonentes = secondaryPonentes.slice(index, stopIndex);

    var dataArray = secondaryPonentes.map((ponente, key) => {
      if (ponente.id === "admin") {
        return renderCreatePonenteUi();
      }
      return renderPonente(ponente);
    })

    return (
      <div class="mt-20 mb-auto w-full">
        <div class="sm:grid sm:grid-cols-4 gap-6 auto-rows-max">
          {dataArray}
        </div>
        <div class="flex flex-row justify-center my-5">
          {index !== 0 &&
            <div id="backwards" class="mx-2 cursor-pointer bg-gray-400 w-12 text-center text-white" onClick={moveInGrid}>
              &lt;
          </div>
          }
          {index + numberOfElements < ponentes.length &&
            <div id="forward" class="mx-2 cursor-pointer bg-gray-500 w-12 text-center text-white" onClick={moveInGrid}>
              &gt;
          </div>
          }
        </div>
      </div>
    )
  }

  const renderCreatePonenteUi = () => {
    return (
      <div class="border-dashed  border-gray-400 border-2 cursor-pointer text-gray-500
       hover:bg-gray-400 hover:text-white py-3 max-h-64 h-64"

        onClick={(e) => {
          setShowModal(true);
        }}
      >
        <div class="p-2">
          <h3 class="text-center text-xl font-medium leading-8">
            Añadir
          </h3>
        </div>
      </div>
    );
  }

  const renderPonente = (ponente) => {
    
    console.log(imageDict[ponente.id])
    return (
      <div class="bg-blue-50  py-3 px-3 sm:max-w-xs max-h-64 relative">
        {isAdmin && (
          <div
            id={ponente.id}
            class="bg-red-500 text-white text-center cursor-pointer z-3 absolute top-0 right-0 "
            style={{ width: "30px" }}
            onClick={(e) => {
              deletePonente(e.target.id);
            }}
          >
            -
          </div>
        )}
        <div class="photo-wrapper p-2">
          <img
            class="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto"
            src={imageDict[ponente.id]}
            alt="John Doe"
            
          />
        </div>
        <div class="p-2">
          <h3 class="text-center sm:text-xl text-gray-900 font-medium leading-8">
            {ponente.name}
          </h3>
          <div class="text-center text-gray-400 text-xs font-semibold">
            <p>{ponente.title}</p>
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
        isCreating={isCreating}
      />
      <div class="max-w-5xl mx-auto w-full h-full">
        <div class="flex flex-wrap justify-center h-full">
          {renderGrid()}
        </div>
      </div>
    </GeneralLayout>
  );
}
