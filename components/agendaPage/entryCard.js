import React from 'react';

import DeleteButton from '../adminComponentes/deleteButton';


export default function EntryCard({ ...props }) {
    /**
     * Recives array of items to display as list for agenda
     
     props = {
        data = { id: ..., title: ..., date: ...}
     }

     */


    return (
        <div className="shadow h-24 w-10/12 flex flex-col justify-center align-center items-center">
            <div className="h-1/4 flex flex-row w-full relative">
                <div className="text-center bg-gray-400 text-gray-100 w-full">
                    {props.data.title} - {" "}
                    {new Date(props.data.date).toLocaleTimeString([], {
                        timeStyle: "short"
                    })}
                </div>
                <DeleteButton id={props.data.id} item={"Agenda"} />
            </div>
            <div
                className="font-thin h-3/4 bg-blue-50 w-full text-blue-700 p-2 text-center"
                id="body"
            >
                {props.data.description}
            </div>
        </div>
    )
}

