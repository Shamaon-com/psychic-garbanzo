import React, { useState, useEffect } from 'react';

// Amplify
import { API, graphqlOperation } from 'aws-amplify';
import * as mutations from '../src/graphql/mutations';
import * as queries from '../src/graphql/queries';
import * as subscriptions from '../src/graphql/subscriptions';

// Utils
import { useModalFields } from '../utils/hooksLib';

// Components
import GeneralLayout from '../layouts/generalLayout';
import Chat from '../components/eventoPage/chat';
import Iframe from '../components/generalComponents/iframe';
import Modal from '../components/generalComponents/modal';
import QuestionBox from '../components/eventoPage/questionBox';
import DeleteButton from '../components/adminComponentes/deleteButton';
import Tabs from '../components/containers/tabs';
import AddButtonAndTitle from '../components/adminComponentes/addButtonAndTitle';

export default function Home() {


	const [iframe, setIframe] = useState({});
	const [showModal, setShowModal] = useState(false);
	const [isCreating, setIsCreating] = useState(false);


	const [fields, handleFieldChange] = useModalFields({
		title: { type: 'default', value: '' },
		url: { type: 'default', value: '' },
	});

	useEffect(() => {
		onPageRendered();
	}, []);

	const onPageRendered = async () => {
		getIframe();
		subscribeCreateIframe();
		subscribeDeleteIframe();
	};

	const getIframe = () => {
		API.graphql(graphqlOperation(queries.listIframes)).then((data) => {
			console.log(data.data.listIframes.items)
			setIframe(data.data.listIframes.items[0]);
		});
	};

	const subscribeCreateIframe = async () => {
		await API.graphql(
			graphqlOperation(subscriptions.onCreateIframe)
		).subscribe({
			next: (subonCreateEvent) => {
				setIframe(subonCreateEvent.value.data.onCreateIframe);
			},
		});
	};

	const subscribeDeleteIframe = async () => {
		await API.graphql(graphqlOperation(subscriptions.onDeleteIframe)).subscribe({
		  next: (subonDeleteIframe) => {
			setIframe(null)
		  },
		});
	  };

	const createIframe = (e) => {
		if (fields.title === '' || fields.url === '') {
			alert('Mensaje vacio');
			return;
		}

		var itemDetails = {
			url: fields.url.value,
			title: fields.title.value,
		};

		console.log('Event Details : ' + JSON.stringify(itemDetails));
		API.graphql(
			graphqlOperation(mutations.createIframe, { input: itemDetails })
		);

		setShowModal(false);
	};




	return (
		<GeneralLayout>
			<Modal
				element={'Evento'}
				fields={fields}
				handleFieldChange={handleFieldChange}
				submit={createIframe}
				showModal={showModal}
				setShowModal={setShowModal}
				isCreating={isCreating}
			/>
			<div className="flex mx-auto container w-full lg:items-center h-full lg:h-4/5  lg:px-8">
				<div className="flex flex-col mx-auto h-full w-full lg:flex-row">
					<div className="flex flex-col w-full pt-4 lg:pt-8 lg:px-5 lg:h-full lg:w-3/4">
						{iframe ? (
							<>
								<div
									className="lg:text-5xl text-gray-500"
									style={{ height: '10%' }}
								>
									{iframe.title}
								</div>
								<div
									className="flex-1 w-full h-full relative"
									style={{ height: '90%' }}
								>
									<DeleteButton id={iframe.id} item={'Iframe'} />
									<Iframe src={iframe.url} />
								</div>
							</>
						) : (
							<AddButtonAndTitle title={"Anade un nuevo evento"} setShowModal={setShowModal}/>
						)}
					</div>
					<div className="flex flex-col w-full flex-grow pt-4 lg:my-auto lg:pt-8 lg:px-5 lg:h-5/6 lg:w-1/4">
						<Tabs data={[
							{ id: 'chat', component: <Chat />, name: 'Chat' },
							{ id: 'preguntas', component: <QuestionBox />, name: 'Preguntas' }
						]} />
					</div>
				</div>
			</div>
		</GeneralLayout>
	);
}
