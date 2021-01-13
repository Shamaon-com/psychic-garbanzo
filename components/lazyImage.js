import React, { useState, useEffect } from "react";
import { Storage } from "aws-amplify";

export default function LazyImage({ ...props }) {
    /**
     * Recived props:
     * - item image ikey
     * 
     */

    const [source, setSource] = useState("")

    useEffect(() => {
        getImage(props.s3Key);

    }, []);


    async function getImage(key) {
        Storage.get(key).then((data) => {
            setSource(data);
        })
    }; 

    const setClass = () => {

        switch(props.type){
            case "rounded":
                return "h-48 w-48 sm:h-32 sm:w-32 md rounded-full relative"
            default:
                return ""
        }
    }

    return (
        
        <img
            class={setClass()}
            src={source}
            alt="John Doe"
        />
       
    );

}
