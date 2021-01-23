import React, { useState, useEffect, useRef, useContext } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import * as mutations from '../config/graphql/mutations';
import * as queries from '../config/graphql/queries';
import * as subscriptions from '../config/graphql/subscriptions';
import { AuthContext } from '../utils/functionsLib';

import useDynamicRefs from 'use-dynamic-refs';

export default function QuestionBox() {
	const [question, setQuestion] = useState('');
	const [questions, setQuestions] = useState([]);
	const [getRef, setRef] = useDynamicRefs();
	const questionsEndRef = useRef(null);
	const authContext = useContext(AuthContext);

	const getQuestions = () => {
		API.graphql(graphqlOperation(queries.listQuestions)).then((data) => {
			setQuestions(sortArray(data.data.listQuestions.items));
			scrollToBottom();
		});
	};

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

	const deleteQuestion = (e) => {
		var target = e.target;
		while (target && target.id === '') {
			target = target.parentNode;
			console.log(target);
		}

		var itemDetails = {
			id: target.id,
		};
		API.graphql(
			graphqlOperation(mutations.deleteQuestion, { input: itemDetails })
		);
	};

	const subscribeCreateQuestion = async () => {
		await API.graphql(
			graphqlOperation(subscriptions.onCreateQuestion)
		).subscribe({
			next: (subonCreateEvent) => {
				console.log('question sub create');
				setQuestions((questions) =>
					sortArray([
						...questions,
						subonCreateEvent.value.data.onCreateQuestion,
					])
				);
				scrollToBottom();
			},
		});
	};

	const createQuestion = (e) => {
		if (question === '') {
			alert('Mensaje vacio');
			return;
		}

		var itemDetails = {
			user: authContext.attributes.email,
			question: question,
		};

		console.log('Event Details : ' + JSON.stringify(itemDetails));
		API.graphql(
			graphqlOperation(mutations.createQuestion, { input: itemDetails })
		);
		setQuestion('');
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
		questionsEndRef.current.scrollIntoView();
	};

	const showDelete = (e) => {
		if (authContext.isAdmin) {
			var target = e.target;
			while (target && target.id === '') {
				target = target.parentNode;
			}
			const showDeleteRef = getRef(target.id);
			showDeleteRef.current.style.display = 'block';
		}
	};

	const hideDelete = (e) => {
		if (authContext.isAdmin) {
			var target = e.target;
			while (target && target.id === '') {
				target = target.parentNode;
			}
			const showDeleteRef = getRef(target.id);
			showDeleteRef.current.style.display = 'none';
		}
	};

	return (
		// <div class="flex flex-col h-mobile lg:h-full w-full border-8 border-gray-300">
		// 	<div class="flex justify-between items-center text-white p-1 bg-gray-500 shadow-lg mr-5 w-full">
		// 		<div class="max-w-2xl bg-white py-10 px-5 m-auto w-full mt-10">
		// 			<div class="text-3xl mb-6 text-center">
		// 				Escribe tu pregunta
		// 			</div>

		// 			<div class="flex max-w-xl m-auto">
		// 				<div class="m-auto">
		// 					<textarea
		// 						onChange={(e) => {
		// 							setQuestion(e.target.value);
		// 						}}
		// 						class="m-auto pl-4 pr-16 py-2 border border-blue-700 focus:outline-none"
		// 						placeholder="Pregunta"
		// 					></textarea>

		// 					<div class="text-right">
		// 						<button
		// 							class="text-blue-600 bg-white hover:text-blue-500 py-1 w-auto transistion-color duration-100 focus:outline-none"
		// 							onClick={(e) => {
		// 								createMessage(e);
		// 							}}
		// 						>
		// 							Enviar
		// 						</button>
		// 					</div>
		// 				</div>
		// 			</div>
		// 		</div>
		// 	</div>
		// </div>
		<div class="flex flex-col h-mobile lg:h-full w-full border-8 border-gray-300">
			<div class="flex justify-between items-center text-white p-1 bg-gray-500 shadow-lg mr-5 w-full">
				<div class="flex items-center">
					<h2 class="font-semibold tracking-wider">
						Escribe tu pregunta
					</h2>
				</div>
			</div>

			<div class="relative bg-white h-100%">
				<input
					type="text"
					name="message"
					onChange={(e) => {
						setMessage(e.target.value);
					}}
					class="pl-4 pr-16 py-2 border border-blue-700 focus:outline-none w-full"
				/>
				<button
					class="absolute right-0 bottom-0 text-blue-600 bg-white  hover:text-blue-500 m-1 
                        px-3 py-1 w-auto transistion-color duration-100 focus:outline-none"
					onClick={(e) => {
						createMessage(e);
					}}
				>
					Send
				</button>
			</div>
		</div>
	);
}
