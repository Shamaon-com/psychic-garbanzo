import React, { useState, useEffect } from 'react';

// Amplify
import { API, graphqlOperation } from "aws-amplify";
import * as subscriptions from "../src/graphql/subscriptions";

// Utils
import { useModalFields } from '../utils/hooksLib';
import { graphqlGet, graphqlCreate } from "../utils/graphqlOperations";

// Components
import GeneralLayout from '../layouts/generalLayout';
import Modal from '../components/generalComponents/modal';
import FullPage from '../components/containers/fullPage';
import List from '../components/containers/list';
import AddButtonAndTitle from '../components/adminComponentes/addButtonAndTitle';
import EntryCard from '../components/agendaPage/entryCard';
import Tabs from '../components/containers/tabs';



export default function Agenda() {

  const [agendas, setAgendas] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);


  const [fields, handleFieldChange] = useModalFields({
    title: { type: "default", value: "" },
    description: { type: "default", value: "" },
    date: { type: "date", value: { day: 0, month: 0, hour: 0, minute: 0 } },
  });


  useEffect(() => {
    //onPageRendered();
    graphqlGet('listAgendas', setAgendas);
    subscribeCreateAgenda();
    subscribeDeleteAgenda();

  }, []);

  const subscribeDeleteAgenda = async () => {
    await API.graphql(graphqlOperation(subscriptions.onDeleteAgenda)).subscribe({
      next: (subonDeleteAgenda) => {
        setAgendas((agendas) => [
          ...agendas.filter(
            (agenda) => agenda.id != subonDeleteAgenda.value.data.onDeleteAgenda.id
          ),
        ]);
      },
    });
  };

  const subscribeCreateAgenda = async () => {
    await API.graphql(graphqlOperation(subscriptions.onCreateAgenda)).subscribe({
      next: (subonCreateAgenda) => {
        setAgendas((agendas) => [
          ...agendas,
          subonCreateAgenda.value.data.onCreateAgenda,
        ]);
      },
    });
  };


  const createAgenda = (e) => {
    setIsCreating(true);


    var itemDetails = {
      title: fields.title.value,
      description: fields.description.value,
      date: new Date(
        2020,
        fields.date.value.month,
        fields.date.value.day,
        fields.date.value.hour,
        fields.date.value.minute
      ).toString()
    };

    graphqlCreate("createAgenda", itemDetails);

    setIsCreating(false);
    setShowModal(false);
  };



  const parseDates = () => {
    /**
     * set dates as key and group items by date
     */

    let dataArray = agendas;

    let dataDict = {};

    dataArray.sort(function (a, b) {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    dataArray.map((item) => {
      let key = new Date(item.date).toDateString();
      if (dataDict[key] === undefined) {
        dataDict[key] = [<EntryCard data={item} />];
      } else {
        dataDict[key].push(<EntryCard data={item} />);
      }
    });

    let returnArray = []

    for (let dictKey in dataDict) {
      returnArray.push(
        {
          id: dictKey,
          component: <List data={dataDict[dictKey]} />,
          name: new Date(dictKey).toLocaleDateString([], {
            dateStyle: "medium",
          })
        }
      )
    }
    return returnArray;
  };

  return (
    <GeneralLayout>
      <FullPage>
        <Modal
          element={"Agenda"}
          fields={fields}
          handleFieldChange={handleFieldChange}
          submit={createAgenda}
          showModal={showModal}
          setShowModal={setShowModal}
          isCreating={isCreating}
        />
        <div className="flex flex-col justify-center" style={{ height: "20%" }}>
          <AddButtonAndTitle title={"Agenda"} setShowModal={setShowModal} />
        </div>
        <div style={{ height: "80%"}}>
          <Tabs data={parseDates()} />
        </div>
      </FullPage>
    </GeneralLayout>
  );
}
