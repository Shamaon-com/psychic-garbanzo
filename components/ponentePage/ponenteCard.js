import React, { useEffect } from 'react';

import DeleteButton from '../adminComponentes/deleteButton';
import LazyImage from '../generalComponents/lazyImage';
import LazyUrl from '../generalComponents/lazyUrl'
import { Storage } from "aws-amplify";

export default function PonenteCard({ ...props }) {
    /**
     * 
     props = {
        data = { id: ..., title: ..., date: ...}
     }

     */

    useEffect(() => {
      console.log(props.data)
    })
    return (
      <div key={props.data.id}  className="py-3 px-3 h-96 mx-5 relative sm:mx-0 sm:h-64  bg-blue-50">
        <DeleteButton id={props.data.id} item={"Ponente"} />
        <div  className="flex justify-center items-center h-2/3">
          <LazyImage s3Key={props.data.image} type="rounded" />
        </div>
        <div  className="m-2 h-1/3">
          <h3  className="text-center sm:text-xl text-gray-900 font-medium leading-8">
            {props.data.name}
          </h3>
          <div  className="text-center text-gray-400 text-xs font-semibold">
            <p>{props.data.title}</p>
          </div>
          <div  className="text-center my-1">
            <LazyUrl data={props.data.pdf} text={"Ver perfil"} />
          </div>
        </div>
      </div>
    );
  
}