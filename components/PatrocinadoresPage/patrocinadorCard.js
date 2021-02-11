import React from 'react';

import DeleteButton from '../adminComponentes/deleteButton';
import LazyImage from '../generalComponents/lazyImage';


export default function PatrocinadorsCard({ ...props }) {
    /**
     * 
     props = {
        data = { id: ..., title: ..., date: ...}
     }

     */

    return (
      <div key={props.data.id}  className="shadow bg-white py-5 px-5 sm:max-w-xs max-h-40 relative mb-5">
        <DeleteButton id={props.data.id} item={"Patrocinador"} />
        <a href={props.data.link}>
          <div key={props.data.id} className="flex justify-center photo-wrapper w-full h-full">
              <LazyImage s3Key={props.data.file} />
          </div>
        </a>
      </div>
    );
  
}