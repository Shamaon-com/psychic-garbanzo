import React, { useEffect } from 'react';

import DeleteButton from '../adminComponentes/deleteButton';
import LazyImage from '../generalComponents/lazyImage';
import LazyUrl from '../generalComponents/lazyUrl'
import { Storage } from "aws-amplify";
import {videoIcon } from "../../utils/svg";

export default function FileCard({ ...props }) {
    /**
     * 
     props = {
        setIframeSrc = {setIframeSrc()}
        data = { id: ..., title: ..., date: ...}
     }
    */


    return (
        <div key={props.data.id} className="shadow flex w-full flex-row h-20 relative">
            <DeleteButton id={props.data.id} item={"Ponente"} />
            <div className="flex flex-col w-1/6 h-full justify-center items-center">
                <div onClick={(e) => props.setIframeSrc(props.data.videoUrl)}>
                    {videoIcon()}
                </div>
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