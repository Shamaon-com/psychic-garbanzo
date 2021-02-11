import React, {useContext} from 'react';
import { AuthContext } from "../../utils/functionsLib";

import DeleteButton from '../adminComponentes/deleteButton';
import LazyImage from '../generalComponents/lazyImage';
import LazyUrl from '../generalComponents/lazyUrl'


export default function PonenteCard({ ...props }) {
    /**
     * 
     props = {
        data = { id: ..., title: ..., date: ...}
     }

     */

    const authContext = useContext(AuthContext);
    const generalSettings = authContext.generalSettings[0];


    return (
      <div key={props.data.id}  className="shadow py-3 px-3 h-96 mx-5 relative sm:mx-0 sm:h-64"
        style={{backgroundColor: generalSettings.boxBackgroundColor}}>
        <DeleteButton id={props.data.id} item={"Ponente"} />
        <div  className="flex justify-center items-center h-2/3">
          <LazyImage s3Key={props.data.image} type="rounded" />
        </div>
        <div  className="m-2 h-1/3">
          <h3  className="text-center sm:text-xl font-medium leading-8"
          style={{color: generalSettings.boxInnerTextColor}}
          >
            {props.data.name}
          </h3>
          <div  className="text-center text-xs font-semibold"
            style={{color: generalSettings.boxTitleColor}}
          >
            <p>{props.data.title}</p>
          </div>
          <div  className="text-center my-1">
            <LazyUrl data={props.data.pdf} text={"Ver perfil"} />
          </div>
        </div>
      </div>
    ); 
}