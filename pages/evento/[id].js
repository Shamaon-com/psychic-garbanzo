import React, { useState, useEffect } from 'react';

// Amplify
import { API, graphqlOperation } from 'aws-amplify';
import * as queries from '../../src/graphql/queries';

// Utils
import { useRouter } from 'next/router';

// Components
import GeneralLayout from '../../layouts/generalLayout';
import Chat from '../../components/eventoPage/chat';
import Iframe from '../../components/generalComponents/iframe';
import QuestionBox from '../../components/eventoPage/questionBox';
import Tabs from '../../components/containers/tabs';

const Home = () => {

    const [data, setData] = useState({});
    const router = useRouter()

	useEffect(() => {

        const { id } = router.query
		getEvento(id);
	}, []);

	const getEvento = async (id) => {
        const eventoData = await API.graphql({ query: queries.getEvento, variables: { id: id }});
        console.log(eventoData)
        setData(eventoData.data.getEvento);
	};

	return (
        <div className="flex mx-auto container w-full lg:items-center h-full lg:h-4/5  lg:px-8">
            <div className="flex flex-col mx-auto h-full w-full lg:flex-row">
                <div className="flex flex-col w-full pt-4 lg:pt-8 lg:px-5 lg:h-full lg:w-3/4">
                    <div
                        className="lg:text-5xl text-gray-500"
                        style={{ height: '10%' }}
                    >
                        {data.title}
                    </div>
                    <div
                        className="flex-1 w-full h-full relative"
                        style={{ height: '90%' }}
                    >
                        <Iframe src={data.url} />
                    </div>
                </div>
                <div className="flex flex-col w-full flex-grow pt-4 lg:my-auto lg:pt-8 lg:px-5 lg:h-5/6 lg:w-1/4">
                    <Tabs data={[
                        { id: 'chat', component: <Chat />, name: 'Chat' },
                        { id: 'preguntas', component: <QuestionBox />, name: 'Preguntas' }
                    ]} />
                </div>
            </div>
        </div>
		
	);
}

Home.layout = GeneralLayout;

export default Home;

/** */