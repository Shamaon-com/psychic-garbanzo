import React, { useContext } from "react";
import { AuthContext } from "../../utils/functionsLib";

export default function AddButtonAndTitle({ ...props }) {
    /**
     * Recives item id to delete and delete function to be called
     *
     * props = {
        title: ...
        setShowModal: setShowModal()
        }
     */


    const authContext = useContext(AuthContext);
    const generalSettings = authContext.generalSettings[0];


    return (
        <>

            <div class="flex flex-row items-center">
                <div
                    className="text-3xl sm:text-5xl"
                    style={{ color: generalSettings.titleColor }}
                >
                    {props.title}
                </div>
                {authContext.isAdmin &&
                    <div
                        className="
                            flex flex-col justify-center
                            bg-blue-500 text-white text-center cursor-pointer mx-5 my-4 w-10 h-8"
                        onClick={() => {
                            props.setShowModal(true);
                        }}
                    >
                        +
                    </div>
                }
            </div>
        </>
    );
}
