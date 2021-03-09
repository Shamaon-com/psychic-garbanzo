import React, { useContext } from 'react';
import { AuthContext } from "../../utils/functionsLib";

import DeleteButton from '../adminComponentes/deleteButton';
import { videoIcon } from "../../utils/svg";

export default function VideoCard({ ...props }) {
    /**
     * 
     props = {
        setIframeSrc = {setIframeSrc()}
        data = { id: ..., title: ..., date: ...}
     }
    */

    const authContext = useContext(AuthContext);
    const generalSettings = authContext.generalSettings[0];


    return (
        <div key={props.data.id} className="shadow flex w-full sm:w-8/12 flex-row h-20 relative"
            style={{ backgroundColor: generalSettings.boxBackgroundColor }}
        >
            <DeleteButton id={props.data.id} item={"Recurso"} />
            <div className="flex flex-col w-1/6 h-full justify-center items-center">
                <div onClick={(e) => props.setIframeSrc(props.data.videoUrl)}>
                    {videoIcon()}
                </div>
            </div>
            <div className="flex flex-col w-5/6 justify-center align-center">
                <div className="mb-1"
                    style={{ color: generalSettings.boxTitleColor }}
                >
                    {props.data.name}
                </div>
                <div style={{ color: generalSettings.boxInnerTextColor }}>
                    {props.data.text}
                </div>
            </div>
        </div>
    );

}