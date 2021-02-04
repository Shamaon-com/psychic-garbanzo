import React, { useEffect } from 'react';
import DeleteButton from '../adminComponentes/deleteButton';


export default function EntryList({ ...props }) {
    /**
     * Recives array of items to display as list for agenda
     props = {
         deleteFunction: deleteAgenda,
         data: [
             { title: ..., date: ..., description: ... }
         ]
     }
     */
    useEffect(() => {
        console.log(props.data)
    })

    return (
        <div className="flex flex-col space-y-4 w-full">
            {props.data.map((agenda, key) => {
                return (
                    <div key={key} className="w-full h-24 flex flex-col justify-center align-center items-center">
                        <div className="h-1/4 flex flex-row w-full relative">
                            <div className="text-center bg-gray-400 text-gray-100 w-full">
                                {agenda.title} - {" "}
                                {new Date(agenda.date).toLocaleTimeString([], {
                                    timeStyle: "short"
                                })}
                            </div>
                            <DeleteButton id={agenda.id} deleteFunction={props.deleteAgenda} />
                        </div>
                        <div
                            className="font-thin h-3/4 bg-blue-50 w-full text-blue-700 p-2 text-center"
                            id="body"
                        >
                            {agenda.description}
                        </div>
                    </div>
                )
            })
            }
        </div>
    )

}
