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
                className="mt-1 self-center block py-2 px-3 border border-gray-300 bg-white rounded-md text-center
                         shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm w-48"
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
        <div className="my-auto flex flex-col justify-center items-center">
            <div className="flex flex-row mb-10">
                {isMobile ? renderTabsMobile() : renderTabs()}
            </div>
            <div className="flex w-full">
                {renderTabContent()}
            </div>
        </div>
    )

}
