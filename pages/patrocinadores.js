import GeneralLayout from "../layouts/generalLayout";
import Modal from "../components/modal";
import React, { useState, useEffect, useContext } from "react";
import { API, graphqlOperation, Storage } from "aws-amplify";
import * as mutations from "../config/graphql/mutations";
import * as queries from "../config/graphql/queries";
import * as subscriptions from "../config/graphql/subscriptions";
import { AuthContext } from "../utils/functionsLib";
import { useFormFields } from "../utils/hooksLib";
import LazyImage from "../components/lazyImage"


export default function Patrocinador() {

  const authContext = useContext(AuthContext);

  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Specifc to page
  const [patrocinadors, setPatrocinadors] = useState([]);
  const [imageDict, setimageDict] = useState({});
  const [index, setIndex] = useState(0);
  const mobileCols = 4
  const pcCols = 12
  const [numberOfElements, setNumberOfElements] = useState(mobileCols)
  const [fields, handleFieldChange] = useFormFields({
    name: "",
    link: "",
    image: ""
  });

  useEffect(() => {
    onPageRendered();

  }, []);


  useEffect(() => {
    handleResize();
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
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
    const filename = fields.name + "_" + fields.image[0].name;

    var itesmetails = {
      name: fields.name,
      link: fields.link,
      file: filename.replace(/\s+/g, '')
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
  
      if(authContext.isAdmin){
      
        setPatrocinadors([{id: "admin"}, ...data.data.listPatrocinadors.items]);
      }else{
        setPatrocinadors(data.data.listPatrocinadors.items)
      }
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

  const submit = () => {
    /**
     * This function is trigged when create button is pressed in Modal component,
     * it will create patrocinador and upload the correspoing image to s3
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
        
        createPatrocinador();
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
      setNumberOfElements(pcCols)
      setIndex(0)
    } else {
      setNumberOfElements(mobileCols)
      setIndex(0)
    }
  }

  const calculateStopIndex = () => {

    if (index < index + numberOfElements && index + numberOfElements < patrocinadors.length) {
      return index + numberOfElements;
    }
    else {
      return patrocinadors.length;
    }
  }


  /**
   * 
   * Render Functions
   */

  const renderGrid = () => {


    var secondaryPatrocinadors = patrocinadors;
    var stopIndex = calculateStopIndex();
    secondaryPatrocinadors = secondaryPatrocinadors.slice(index, stopIndex);

  
    var dataArray = secondaryPatrocinadors.map((patrocinador, key) => {
      if (patrocinador.id === "admin") {
        return renderCreatePatrocinadorUi();
      }
        return renderPatrocinador(patrocinador);
    })

    return (
      <div class="mt-20 mb-auto w-full">
        <div class="grid grid-cols-2 sm:grid sm:grid-cols-4 gap-6 auto-rows-max">
          {dataArray}
        </div>
        <div class="flex flex-row justify-center my-5">
          {index !== 0 &&
            <div id="backwards" class="mx-2 cursor-pointer bg-gray-400 w-12 text-center text-white" onClick={moveInGrid}>
              &lt;
          </div>
          }
          {index + numberOfElements < patrocinadors.length &&
            <div id="forward" class="mx-2 cursor-pointer bg-gray-500 w-12 text-center text-white" onClick={moveInGrid}>
              &gt;
          </div>
          }
        </div>
      </div>
    )
  }

  const renderCreatePatrocinadorUi = () => {
    return (
      <div class="border-dashed  border-gray-400 border-2 cursor-pointer text-gray-500
       hover:bg-gray-400 hover:text-white py-3"

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

  const renderPatrocinador = (patrocinador) => {
    
    return (
      <div class="py-5 px-5 sm:max-w-xs max-h-40 relative">
        {authContext.isAdmin && (
          <div
            id={patrocinador.id}
            class="bg-red-500 text-white text-center cursor-pointer z-3 absolute top-0 right-0 "
            style={{ width: "30px" }}
            onClick={(e) => {
              deletePatrocinador(e.target.id);
            }}
          >
            -
          </div>
        )}
        <a href={patrocinador.link}>
          <div class="photo-wrapper w-full h-full">
              <LazyImage s3Key={patrocinador.file} />
          </div>
        </a>
      </div>
    );
  };


  return (
    <GeneralLayout authContext={authContext}>
      <Modal
        element={"Patrocinador"}
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
