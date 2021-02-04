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


    const renderTabContent = () => {

        if(props.data[selected] !== undefined){
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
                                "flex flex-col w-1/2 text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none" +
                                (selected == index && " text-blue-500 border-b-2 font-medium border-blue-500")
                            }
                            onClick={() => setSelected(index)}>
                            {item.name}
                        </div>
                    )
                })}
            </>
        )
    }

    return (
        <div className="h-full my-auto">
            <div className="flex flex-row" style={{ height: '10%' }}>
                {renderTabs()}
            </div>
            <div className="flex" style={{ height: '90%' }}>
                {renderTabContent()}
            </div>
        </div>
    )

}
