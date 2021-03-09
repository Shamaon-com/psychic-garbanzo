import React, {useContext} from 'react';
import { AuthContext } from "../../utils/functionsLib";

import DeleteButton from '../adminComponentes/deleteButton';


export default function EntryCard({ ...props }) {
    /**
        Recives array of items to display as list for agenda
        props = {
            data = { id: ..., title: ..., date: ...}
        }
    */

   const authContext = useContext(AuthContext);
   const generalSettings = authContext.generalSettings[0]


    return (
        <div 
        key={props.data.id}
        className="shadow h-24 w-full sm:w-10/12 flex flex-col justify-center align-center items-center"
        >
            <div className="h-1/4 flex flex-row w-full relative">
                <div className="text-center text-gray-100 w-full"
                     style={{backgroundColor: generalSettings.boxBorderColor}}
                >
                    {props.data.title} - {" "}
                    {new Date(props.data.date).toLocaleTimeString([], {
                        timeStyle: "short"
                    })}
                </div>
                <DeleteButton id={props.data.id} item={"Agenda"} />
            </div>
            <div
                className="font-thin h-3/4 w-full text-blue-700 p-2 text-center"
                style={{backgroundColor: generalSettings.boxBackgroundColor}}
                id="body"
            >
                {props.data.description}
            </div>
        </div>
    )
}

