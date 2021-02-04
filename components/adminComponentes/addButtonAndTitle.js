import React, { useContext } from "react";
import { AuthContext } from "../../utils/functionsLib";

export default function AddButtonAndTabs({ ...props }) {
    /**
     * Recives item id to delete and delete function to be called
     *
     */

    const authContext = useContext(AuthContext);

    return (
        <>
            { authContext.isAdmin &&
                <div class="flex flex-row">
                    <div
                        className="text-5x1 lg:text-5xl text-gray-500"
                    >
                        Crea un nuevo evento
                    </div>
                    <div
                        className="bg-blue-500 text-white text-center cursor-pointer mx-5 my-4 w-10 h-6"
                        onClick={(e) => {
                            setShowModal(true);
                        }}
                    >
                        +
                    </div>
                </div>
            }
        </>
    );
}
