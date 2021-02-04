import React, { useContext } from 'react';
import { AuthContext } from '../../utils/functionsLib';

export default function DeleteButton({ ...props }) {
    /**
     * Recives item id to delete and delete function to be called
     * 
     */
    
    const authContext = useContext(AuthContext);
    
    return (
        <>
            {authContext.isAdmin && (
                <div
                    id={props.id}
                    className="bg-red-500 text-white text-center cursor-pointer z-50 absolute top-0 right-0"
                    style={{ width: "50px" }}
                    onClick={(e) => {
                        props.deleteFunction(e.target.id);
                    }}
                >
                    -
                </div>
            )}
        </>
    )

}
