import React, {useContext, useState} from 'react';
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
    const [isLoaded, setIsLoaded] = useState(false);
    const authContext = useContext(AuthContext);
    const generalSettings = authContext.generalSettings[0];


    const loader = () => {

      return (
          <div className="border border-light-red-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
          <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-white h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-white rounded w-3/4"></div>
              <div className="space-y-2">
                  <div className="h-4 bg-white rounded"></div>
                  <div className="h-4 bg-white rounded w-5/6"></div>
              </div>
              </div>
          </div>
          </div>
      )
  }


  return (

        <div key={props.data.id} className="shadow py-3 px-3 h-96 mx-5 relative sm:mx-0 sm:h-64"
          style={{ backgroundColor: generalSettings.boxBackgroundColor }}>
          <DeleteButton id={props.data.id} item={"Ponente"} />
          <div className="flex justify-center items-center h-2/3">
            <LazyImage s3Key={props.data.image} type="rounded" loaded={setIsLoaded}/>
          </div>
          <div className="m-2 h-1/3">
            <h3 className="text-center sm:text-xl font-medium leading-8"
              style={{ color: generalSettings.boxInnerTextColor }}
            >
              {props.data.name}
            </h3>
            <div className="text-center text-xs font-semibold"
              style={{ color: generalSettings.boxTitleColor }}
            >
              <p>{props.data.title}</p>
            </div>
            <div className="text-center my-1">
              <LazyUrl data={props.data.pdf} text={"Ver perfil"} />
            </div>
          </div>
        </div>
  );
}