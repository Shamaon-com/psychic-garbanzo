import AdminLayout from '../../layouts/adminLayout';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import QuestionList from '../../components/containers/questionList';

import { graphqlGet, graphqlCreate } from "../../utils/graphqlOperations";
import * as mutations from '../../src/graphql/mutations';
import * as queries from '../../src/graphql/queries';
import * as subscriptions from '../../src/graphql/subscriptions';


//components
import ContainerPage from "../../components/containers/containerPage";
import Iframe from "../../components/generalComponents/iframe";


const Ponentes = () => {
	const [questions, setQuestions] = useState([]);
	const [eventos, setEventos] = useState([]);
	const [currentEvento, setEvento] = useState(null);
	const questionsEndRef = useRef(null);


	useEffect(() => {
		graphqlGet("listEventos", setEventos);
		subscribeDeleteQuestion();
		subscribeCreateQuestion();
	}, []);

	const searchEvento = (index) => {

		console.log(index)
		if(index == 99999){
			setEvento(null)
			return;
		}

		const getEvento = async () => {
			const eventoData = await API.graphql({ query: queries.getEvento, variables: { id: eventos[index].id } });
			setEvento(eventoData.data.getEvento);
			setQuestions(eventoData.data.getEvento.questionsData.items)
		}

		getEvento();
	};


	/**
	 * CRUD Operation functions
	 */

	const subscribeDeleteQuestion = async () => {
		await API.graphql(
			graphqlOperation(subscriptions.onDeleteQuestion)
		).subscribe({
			next: (subonDeleteEvent) => {
				setQuestions((questions) =>
					sortArray([
						...questions.filter(
							(question) =>
								question.id !=
								subonDeleteEvent.value.data.onDeleteQuestion.id
						),
					])
				);
			},
		});
	};


	const subscribeCreateQuestion = async () => {
		await API.graphql(
			graphqlOperation(subscriptions.onCreateQuestion)
		).subscribe({
			next: (subonCreateEvent) => {
				setQuestions((questions, currentEvento) => {
					console.log(questions, currentEvento)
					return []
				});	
			},
		});
	};

	/**
	 *
	 * Utils
	 */

	const sortArray = (array) => {
		return array.sort(function (a, b) {
			var c = new Date(a.createdAt);
			var d = new Date(b.createdAt);
			return c - d;
		});
	};

	/**
	 * UI Functions
	 */

	const scrollToBottom = () => {
		questionsEndRef.current.scrollIntoView({ behavior: 'smooth' });
	};

	const renderSelect = () => {
		return (
			<select
				id="eventos"
				className="py-2 px-3 border border-gray-300
				  bg-white rounded-md shadow-sm focus:outline-none 
				  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				onChange={(e) => { searchEvento(e.target.value) }}
			>
				<option value={99999}>Seleccione una opción</option>
				{eventos.map((evento, index) => {
					return <option value={index}>{evento.title}</option>
				})
				}
			</select>
		)

	}


	return (

		<ContainerPage>
			<div
				className="bg-white flex flex-col rounded-lg shadow py-10 px-20 overflow-auto h-full"
			>
				<div className="py-5 border-b flex ">
					<div className="flex flex-col w-1/2">
						<p className="text-xl mb-3">Modulos</p>
						<p className="text-gray-500 font-extralight">
							Activa o desactiva ciertos modulos
						</p>
					</div>
					<div className="flex flex-col justify-center items-end w-1/2">
						{renderSelect()}
					</div>
				</div>
				{currentEvento &&
					<div className="flex flex-col h-4/5">
						<div className="h-1/2 mb-3">
							<QuestionList data={questions} />
						</div>
						<div className="mx-auto max-w-2xl w-full">
							<Iframe src={currentEvento.url} />
						</div>
					</div>
				}
			</div>
		</ContainerPage>

	)
}

Ponentes.layout = AdminLayout;

export default Ponentes;