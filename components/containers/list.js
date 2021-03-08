import React, { useEffect } from 'react';



export default function ComponentList({ ...props }) {
    /**
     * Recives array of items to display as list for agenda
     props = {
         deleteFunction: deleteAgenda,
         data: [
             <Component />
         ]
     }
     */

    return (
        <div className="flex flex-col items-center space-y-4 w-full mb-10">
            {props.data.map((component, key) => {
                return (
                    component
                )
            })
            }
        </div>
    )

}
