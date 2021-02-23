import React, { useContext } from 'react';
import { AuthContext } from "../../utils/functionsLib";
import { useRouter } from 'next/router';

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
  const router = useRouter();

  return (
    <div
       key={props.data.id} 
       className="cursor-pointer shadow py-3 px-3 h-96 mx-5 relative z-1 sm:mx-0 sm:h-64"
       style={{ backgroundColor: generalSettings.boxBackgroundColor }}
       onClick={() => router.push("/evento?id=" + props.data.id)}
    >
      <DeleteButton id={props.data.id} item={"Evento"} />
        <div className="flex justify-center items-center h-full">
          <LazyImage s3Key={props.data.image} type="full" key={props.data.id}/>
        </div>
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