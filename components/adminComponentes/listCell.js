import React from 'react';



export default function ListCell({ ...props }) {
    /**
        Recives array of items to display as list for agenda
        props = {
            item = { id: ..., title: ..., date: ...},
            actionComponent = <Component />
        }
    */

    return (
        <a key={props.data.id} 
           className="flex w-full flex-row  py-3 border-b"
           href={"user?" + props.data.id}   
        >
            <p className="w-1/6 font-light">{props.data.username}</p>
            <p className="flex mr-auto overlfow-hidden w-2/5 font-light">{props.data.email}</p>
            <p className="text-center w-1/6 font-light">{new Date(props.data.createdAt).toLocaleDateString()}</p>
            <p className="text-center w-1/6 font-light">{props.data.banned ? "yes" : "no"}</p>
            <p className=" text-center w-1/6 font-light">{props.data.disabled ? "yes" : "no"}</p>
        </a>
    )
}

