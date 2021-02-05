import React, { useContext } from 'react';
import { AuthContext } from '../../utils/functionsLib';
import { graphqlDelete } from '../../utils/graphqlOperations'; 


export default function DeleteButton({ ...props }) {
    /**
     * Recives item id to delete and delete function to be called
     * 
     */
    
    const authContext = useContext(AuthContext);
    

    const deleteItem = (id) => {
        graphqlDelete("delete" + props.item, id);
    }

    return (
        <>
            {authContext.isAdmin && (
                <div
                    id={props.id}
                    className="bg-red-500 text-white text-center cursor-pointer z-50 absolute top-0 right-0"
                    style={{ width: "50px" }}
                    onClick={(e) => {
                        deleteItem(e.target.id);
                    }}
                >
                    -
                </div>
            )}
        </>
    )

}
