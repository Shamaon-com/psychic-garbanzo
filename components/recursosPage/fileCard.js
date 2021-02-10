import React, { useEffect } from 'react';

import DeleteButton from '../adminComponentes/deleteButton';
import LazyUrl from '../generalComponents/lazyUrl'; 
import {icon } from "../../utils/svg";


export default function FileCard({ ...props }) {
    /**
     * 
     props = {
        setIframeSrc = {setIframeSrc()}
        data = { id: ..., title: ..., date: ...}
     }

*/


    return (
        <div key={props.data.id} className="shadow flex w-10/12 flex-row h-20 relative ">
            <DeleteButton id={props.data.id} item={"Recurso"} />
            <div className="flex flex-col w-1/6 h-full justify-center items-center">
                <LazyUrl data={props.data.file} text={icon()} />
            </div>
            <div className="flex flex-col w-5/6 justify-center align-center">
                <div className="mb-1 text-blue-700">
                    {props.data.name}
                </div>
                {props.data.text}
            </div>
        </div>
    );

}