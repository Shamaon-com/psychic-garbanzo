import React, { useState, useEffect, useContext } from 'react';


// Utils
import { useModalFields } from '../utils/hooksLib';
import { AuthContext } from "../utils/functionsLib";
import * as operation from "../utils/graphqlOperations";

// Components
import GeneralLayout from '../layouts/generalLayout';
import Modal from '../components/generalComponents/modal';
import FullPage from '../components/containers/fullPage';
import ComponentList from '../components/generalComponents/componentList';
import AddButtonAndTitle from '../components/adminComponentes/addButtonAndTitle';

import EntryCard from '../components/agendaPage/entryCard';

import Tabs from '../components/generalComponents/tabs'



export default function Agenda() {
  /**º
   * To do
   *
   * - Improve modal
   * - Display date in a cleaner way
   */

  const [showModal, setShowModal] = useState(false);
  const [agendas, setAgendas] = useState([]);
  const [isCreating, setIsCreating] = useState(false);


  const [fields, handleFieldChange] = useModalFields({
    title: { type: "default", value: "" },
    description: { type: "default", value: "" },
    date: { type: "date", value: {day: 0, month: 0, hour: 0, minute: 0} },
  });


  useEffect(() => {
    //onPageRendered();
    operation.graphqlGet('listAgendas', setAgendas);
  }, []);




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

    console.log("Agenda Details : " + JSON.stringify(itemDetails));
    API.graphql(
      graphqlOperation(mutations.createAgenda, { input: itemDetails })
    );
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

    dataArray.map(( item ) => {
      let key = new Date(item.date).toDateString();
      if (dataDict[key] === undefined) {
        dataDict[key] = [<EntryCard data={item}/>];
      } else {
        dataDict[key].push(<EntryCard data={item}/>);
      }
    });

    let returnArray = []

    for (let dictKey in dataDict) {
      returnArray.push(
        {
          id: dictKey,
          component: <ComponentList data={dataDict[dictKey]} />,
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
        <div className="flex flex-col justify-center" style={{height: "20%"}}>
          <AddButtonAndTitle title={"Agenda"} setShowModal={setShowModal}/>
        </div>
        <Tabs data={parseDates()} />

      </FullPage>
    </GeneralLayout>
  );
}
