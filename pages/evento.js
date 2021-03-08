import React, { useState, useEffect, useContext } from 'react';

// Amplify
import { API, graphqlOperation } from 'aws-amplify';
import * as queries from '../src/graphql/queries';

// Utils
import { useRouter } from 'next/router';
import { AuthContext } from "../utils/functionsLib";

// Components
import GeneralLayout from '../layouts/generalLayout';
import Chat from '../components/eventoPage/chat';
import Iframe from '../components/generalComponents/iframe';
import QuestionBox from '../components/eventoPage/questionBox';
import Tabs from '../components/containers/tabs';

const Home = () => {


    const [data, setData] = useState({});
    const router = useRouter()
    const authContext = useContext(AuthContext);
    const generalSettings = authContext.generalSettings[0];
    const [eventoId, setEventoId] = useState(null)

    useEffect(() => {

        const { id } = router.query
        setEventoId(id)
        getEvento(id);
    }, []);

    const getEvento = async (id) => {
        const eventoData = await API.graphql({ query: queries.getEvento, variables: { id: id } });
        console.log(eventoData)
        setData(eventoData.data.getEvento);
    };

    const renderTabs = () => {
        if (data.chat && data.questions) {
            return [
                { id: 'chat', component: <Chat eventoId={eventoId} />, name: 'Chat' },
                { id: 'preguntas', component: <QuestionBox />, name: 'Preguntas' }
            ]
        }
        else if (data.chat) {
            return [
                { id: 'chat', component: <Chat eventoId={eventoId}/>, name: 'Chat' },
            ]
        }
        else if (data.questions) {
            return [
                { id: 'preguntas', component: <QuestionBox />, name: 'Preguntas' }
            ]
        }
    }

    const renderLayout = () => {
        if (data.chat || data.questions) {
            return (
                <>
                    <div className={`flex mb-5 flex-col w-full px-4 sm:px-8 lg:pt-8 lg:px-5 lg:h-full 
                                ${data.chat || data.questions ? "lg:w-3/4" : "lg:w-full"}`}>
                        <div className=" text-4xl my-5 sm:text-center lg:text-left lg:text-5xl"
                            style={{color:generalSettings.titleColor }}
                        >
                            {data.title}
                        </div>
                        <div
                            className="flex-1 w-full h-full"
                        >
                            <Iframe src={data.url} />
                        </div>
                    </div>
                    <div className="flex flex-col w-full flex-grow sm:p-8 lg:my-auto lg:px-5 lg:h-5/6 lg:w-1/4">
                        {data.chat || data.questions ? <Tabs data={renderTabs()} /> : <></>}
                    </div>
                </>
            )
        } else {
            return (
                <div className="flex mb-5 flex-col w-full px-4 sm:px-8 lg:pt-8 lg:px-5 lg:h-full lg:w-3/4 mx-auto">
                    <div className=" text-4xl my-5 sm:text-center lg:text-left lg:text-5xl"
                    style={{color:generalSettings.titleColor }}
                    >
                        {data.title}
                    </div>
                    <div
                        className="flex-1 w-full h-full"
                    >
                        <Iframe src={data.url} />
                    </div>
                </div>

            )
        }

    }

    return (
        <div className="flex mx-auto max-w-screen-2xl w-full h-full lg:items-center lg:h-4/5  lg:px-8">
            <div className="flex flex-col mx-auto h-full w-full lg:flex-row">
                {renderLayout()}
            </div>
        </div>

    );
}

Home.layout = GeneralLayout;

export default Home;

/** */