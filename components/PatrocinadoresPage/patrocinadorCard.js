import React, { useEffect } from 'react';

import DeleteButton from '../adminComponentes/deleteButton';
import LazyImage from '../generalComponents/lazyImage';
import LazyUrl from '../generalComponents/lazyUrl'

export default function PatrocinadorsCard({ ...props }) {
    /**
     * 
     props = {
        data = { id: ..., title: ..., date: ...}
     }

     */

    return (
      <div key={props.data.id}  className="shadow py-5 px-5 sm:max-w-xs max-h-40 relative">
        <DeleteButton id={props.data.id} item={"Ponente"} />
        <a href={props.data.link}>
          <div key={props.data.id} className="flex justify-center photo-wrapper w-full h-full">
              <LazyImage s3Key={props.data.file} />
          </div>
        </a>
      </div>
    );
  
}