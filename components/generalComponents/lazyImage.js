import React, { useState, useEffect } from "react";
import { Storage } from "aws-amplify";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import 'react-lazy-load-image-component/src/effects/blur.css';

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
        Storage.get(key, {
                level: 'public', // defaults to `public`
            }).then((data) => {
            setSource(data);         
        })
    }; 

    const setClass = () => {

        switch(props.type){
            case "rounded":
                return "h-48 w-48 sm:h-36 sm:w-36 md rounded-full relative"
            case "full":
                return "h-full"
            default:
                return ""
        }
    }

    return (

            <LazyLoadImage
                key={props.key}
                className={setClass()}
                effect="blur"
                src={source} 
                height="100%" 
                 
            />
    );

}
