import { useEffect } from "react";
import React, { useState } from "react";


 export default function Grid({ ...props }) {

    const [array, setArray] = useState([]);
    const [index, setIndex] = useState(0);
    const [mobileCols, setMobileCols] = useState(props.mobileElements);
    const [pcCols, setPcCols] = useState(props.pcElements);

    const [currentCols, setCurrentCols] = useState(mobileCols);


    useEffect(() => {
        setArray(props.data);

    }, [props.data]);

    useEffect(() => {
        handleResize();
        // Add event listener
        window.addEventListener("resize", handleResize);
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
      }, []);


     const moveInGrid = (e) => {
        if (e.target.id === "forward") {
            setIndex(calculateStopIndex())
        }
        if (e.target.id === "backwards") {
            setIndex(index - currentCols)
        }
     }

     const handleResize = () => {
        if (window.innerWidth >= 640) {
            setCurrentCols(pcCols)
            setIndex(0)
        } else {
            setCurrentCols(mobileCols)
            setIndex(0)
        }
     }


     const calculateStopIndex = () => {

        if (index < index + currentCols && index + currentCols < array.length) {
            return index + currentCols;
        }
        else {
            return array.length;
        }
     }

    const createGridClass = () => {

        var toDiveBy = pcCols % 2 != 0 ? 3 : 2

        var pcClass = " sm:grid sm:grid-cols-" + (pcCols/toDiveBy).toString();
        var mobileClass = "grid";
        if(mobileCols > 1){
            mobileClass = mobileClass + " grid-cols-" + 1;
        }

        return mobileCols + pcClass + " gap-6 auto-rows-max";
    }

    const renderGrid = () => {
        
        
        let stopIndex = calculateStopIndex();
        const renderArray = array.slice(index, stopIndex);

        return (
            <div className={createGridClass()}>
                {renderArray.map((item) => {
                    return item
                    })
                }
            </div>
        )
    }

    return (
      <div  className="mb-auto w-full">
        {renderGrid()}
        <div  className="flex flex-row justify-center my-5">
          {index !== 0 &&
            <div id="backwards"  className="mx-2 cursor-pointer bg-gray-400 w-12 text-center text-white" onClick={moveInGrid}>
              &lt;
          </div>
          }
          {index + currentCols < array.length &&
            <div id="forward"  className="mx-2 cursor-pointer bg-gray-500 w-12 text-center text-white" onClick={moveInGrid}>
              &gt;
          </div>
          }
        </div>
      </div>
    )
  }

