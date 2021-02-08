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
        getImage(props.data);

    }, []);


    async function getImage(key) {
        Storage.get(key).then((data) => {
            setSource(data);
        })
    }; 

    return (
        <a
            className="text-xs text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium"
            href={source}
        >
            {props.text}
       </a>
       
    );

}
