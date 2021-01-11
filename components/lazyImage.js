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
        getImage(props.s3Key)

    }, []);


    async function getImage(key) {
        Storage.get(key).then((data) => {
            setSource(data);
            console.log(data)
        })
    }; 


    return (
        <img
            class="w-full h-full image-contain mx-auto"
            src={source}
            alt="John Doe"
        />
    );

}
