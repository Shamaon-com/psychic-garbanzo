import React, { useContext, useEffect } from 'react';
import { AuthContext } from "../../utils/functionsLib";

import DeleteButton from '../adminComponentes/deleteButton';
import LazyImage from '../generalComponents/lazyImage';


export default function EventoCard({ ...props }) {
  /**
   * 
   props = {
      data = { id: ..., title: ..., date: ...}
   }
   */

  const authContext = useContext(AuthContext);
  const generalSettings = authContext.generalSettings[0];

  useEffect(() => {
    console.log(props.data.id)
  }, [])
  
  return (
    <div key={props.data.id} 
       className="cursor-pointer shadow py-3 px-3 mx-5 relative z-1 sm:mx-0 mb-5 h-64 xl:h-72"
       style={{ backgroundColor: generalSettings.boxBackgroundColor }}
    >
        <DeleteButton id={props.data.id} item={"Evento"} />
        <a className='relative w-full h-full' href={"/evento?id=" + props.data.id}>
        <div className="flex justify-center items-center h-full">
          <LazyImage s3Key={props.data.image} type="full" key={props.data.id}/>
        </div>
        </a>
        <div className="absolute bottom-0 right-0 left-0 w-full bg-gray-600 bg-opacity-60">
          <div className="text-center h-1/3 font-semibold text-lg"
            style={{ color: generalSettings.boxTitleColor }}
          >
            <p>{props.data.title}</p>
          </div>
          <div className="p-3 text-center"
            style={{ color: generalSettings.boxInnerTextColor }}
          >
            {new Date(props.data.startDate).toLocaleTimeString([], {
              timeStyle: "short"
            })}
            -
            {new Date(props.data.endDate).toLocaleTimeString([], {
              timeStyle: "short"
            })}
          </div>
        </div>
        
    </div>
  );
}