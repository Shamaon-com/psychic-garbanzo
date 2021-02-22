import React, { useContext } from 'react';
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


  return (
    <div key={props.data.id} className="shadow py-3 px-3 h-96 mx-5 relative z-1 sm:mx-0 sm:h-64"
      style={{ backgroundColor: generalSettings.boxBackgroundColor }}
    >
      <DeleteButton id={props.data.id} item={"Evento"} />
      <a href={"/evento?id=" + props.data.id}  >
        <div className="flex justify-center items-center h-2/3">
          <LazyImage s3Key={props.data.image} type="full" />
        </div>
        <div className="m-2 h-1/3">
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
      </a>
    </div>
  );
}