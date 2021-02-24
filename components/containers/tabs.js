import React, { useState, useEffect } from 'react';

export default function Tabs({ ...props }) {
    /**
     * Recives object to create tabs
    
     props = {
         data = [
             {id: chat, component: <Chat />, name: Chat},
             {id: preguntas, component: <QuestionBox />, name: Preguntas},
             {id: encuestas, component: <Encuestas />, name: encuesta}
         ]
     } 

     */

    const [selected, setSelected] = useState(0);
    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleResize = () => {

        if (window.screen.width >= 640) {
            setIsMobile(false)
        } else {
            setIsMobile(true)
        }
    }

    const getTabStyle = (index) => {

        switch (index) {
            case selected:
                return "w-64 bg-blue-900 hover:bg-blue-800";
            case selected + 1:
                return "w-48 hover:bg-gray-500 bg-gray-400";
            default:
                return "w-48 hover:bg-gray-400 bg-gray-300";
        }
    }

    const renderTabContent = () => {

        if (props.data[selected] !== undefined) {
            return props.data[selected].component
        }

    }


    const renderTabs = () => {

        return (
            <>
                {props.data.map((item, index) => {
                    return (
                        <div
                            className={
                                "py-1 text-center text-white " +
                                getTabStyle(index)
                            }
                            onClick={() => setSelected(index)}>
                            {item.name}
                        </div>
                    )
                })}
            </>
        )
    }


    const renderTabsMobile = () => {


        return (
            <select
                className=""
                onChange={(e) => {
                    setSelected(e.target.value);
                }}
            >
                {props.data.map((item, index) => {
                    return (
                        <option
                            value={index}
                            className={
                                "py-1 text-center text-white " +
                                getTabStyle(index)
                            }
                            onClick={() => setSelected(index)}>
                            {item.name}
                        </option>
                    )
                })}
            </select>
        );

    }

    return (
        <div className="flex flex-col justify-center items-center h-full">
            <div className="flex flex-row mb-5 w-full justify-center">
                {isMobile ? renderTabsMobile() : renderTabs()}
            </div>
            <div className="flex w-full h-full">
                {renderTabContent()}
            </div>
        </div>
    )

}
