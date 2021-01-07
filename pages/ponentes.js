import GeneralLayout from "../layouts/generalLayout";
import Modal from "../components/modal"
import React, { useState, useEffect, useContext } from "react";
import { API, graphqlOperation } from "aws-amplify";
import * as mutations from "../config/graphql/mutations";
import * as queries from "../config/graphql/queries";
import * as subscriptions from "../config/graphql/subscriptions";
import { AuthContext } from "../utils/functionsLib";

import { useFormFields } from "../utils/hooksLib";

export default function Ponentes(props) {
  /**
   * To do
   *
   * - Improve modal
   * - Display date in a cleaner way
   */

  const authContext = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [ponentes, setPonentes] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isAdmin, setIsAdmin] = useState(true);
  const [fields, handleFieldChange] = useFormFields({
    title: "",
    description: "",
    date: "",
  });

  const [datetime, handleDatetimeChange] = useFormFields({
    month: "",
    day: "",
    hour: "",
    minute: "",
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

  const subscribeCreatePonente = async () => {
    await API.graphql(graphqlOperation(subscriptions.onCreatePonente)).subscribe({
      next: (subonCreatePonente) => {
        setPonentes((ponentes) => [
          ...ponentes,
          subonCreatePonente.value.data.onCreatePonente,
        ]);
      },
    });
  };

  const subscribeDeletePonente = async () => {
    await API.graphql(graphqlOperation(subscriptions.onDeletePonente)).subscribe({
      next: (subonDeletePonente) => {
        setPonentes((ponentes) => [
          ...ponentes.filter(
            (event) => event.id != subonDeletePonente.value.data.onDeletePonente.id
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

  const deletePonente = (id) => {
    var itemDetails = {
      id: id,
    };
    API.graphql(
      graphqlOperation(mutations.deletePonente, { input: itemDetails })
    );
  };

  const createPonente = (e) => {
    var itemDetails = {
      title: fields.title,
      description: fields.description,
      date: new Date(
        2020,
        datetime.month,
        datetime.day,
        datetime.hour,
        datetime.minute
      ).toString(),
    };

    console.log("Ponente Details : " + JSON.stringify(itemDetails));
    API.graphql(
      graphqlOperation(mutations.createPonente, { input: itemDetails })
    );
  };


  return (
    <GeneralLayout authContext={authContext}>
          <Modal />
      </GeneralLayout>
  )
}