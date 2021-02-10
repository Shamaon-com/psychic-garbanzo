import React, { useEffect } from 'react';



export default function List({ ...props }) {
    /**
     * Recives array of items to display as list for agenda
     props = {
         deleteFunction: deleteAgenda,
         data: [
             <Component />
         ]
     }
     */
    useEffect(() => {
        console.log(props.data)
    })

    return (
        <div className="flex flex-col items-center space-y-4 w-full">
            {props.data.map((component, key) => {
                return (
                    component
                )
            })
            }
        </div>
    )

}
