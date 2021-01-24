import React, { useState, useEffect, useRef, useContext } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import * as mutations from '../config/graphql/mutations';
import * as queries from '../config/graphql/queries';
import * as subscriptions from '../config/graphql/subscriptions';
import { AuthContext } from '../utils/functionsLib';

import useDynamicRefs from 'use-dynamic-refs';

export default function QuestionList({ ...props }) {
	const [question, setQuestion] = useState('');
	const [questions, setQuestions] = useState([]);
	const [getRef, setRef] = useDynamicRefs();
	const questionsEndRef = useRef(null);
	const authContext = useContext(AuthContext);

	useEffect(() => {
		onPageRendered();
	}, []);

	const onPageRendered = async () => {
		getQuestions();
		subscribeCreateQuestion();
		subscribeDeleteQuestion();
	};

	/**
	 * CRUD Operation functions
	 */

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

	const renderQuestions = () => {
		return (
			<>
				{questions.map((question, key) => {
					let classVar =
						'bg-white text-gray-700 p-2 self-start my-2 rounded-md shadow mr-3';
					if (question.user !== authContext.attributes.email) {
						classVar =
							'bg-green-500 text-white p-2 self-end my-2 rounded-md shadow ml-3';
					}
					return (
						<div
							key={key}
							id={question.id}
							className={classVar}
							onMouseEnter={showDelete}
							onMouseLeave={hideDelete}
						>
							{authContext.isAdmin && (
								<svg
									ref={setRef(question.id)}
									style={{ display: 'none', width: '20px' }}
									className="ml-auto p-0.5 cursor-pointer"
									viewBox="0 0 512 512"
									width="512pt"
									xmlns="http://www.w3.org/2000/svg"
									onClick={deleteQuestion}
								>
									<path
										d="m256 0c-141.164062 0-256 114.835938-256 256s114.835938 256 256 256 256-114.835938 256-256-114.835938-256-256-256zm0 0"
										fill="#f44336"
									/>
									<path
										d="m350.273438 320.105469c8.339843 8.34375 8.339843 21.824219 0 30.167969-4.160157 4.160156-9.621094 6.25-15.085938 6.25-5.460938 0-10.921875-2.089844-15.082031-6.25l-64.105469-64.109376-64.105469 64.109376c-4.160156 4.160156-9.621093 6.25-15.082031 6.25-5.464844 0-10.925781-2.089844-15.085938-6.25-8.339843-8.34375-8.339843-21.824219 0-30.167969l64.109376-64.105469-64.109376-64.105469c-8.339843-8.34375-8.339843-21.824219 0-30.167969 8.34375-8.339843 21.824219-8.339843 30.167969 0l64.105469 64.109376 64.105469-64.109376c8.34375-8.339843 21.824219-8.339843 30.167969 0 8.339843 8.34375 8.339843 21.824219 0 30.167969l-64.109376 64.105469zm0 0"
										fill="#fafafa"
									/>
								</svg>
							)}
							<div className="text-sm">
								{question.user.split('@')[0]} -{' '}
								{new Date(
									question.createdAt
								).toLocaleTimeString()}
							</div>
							{question.question}
						</div>
					);
				})}
				<div ref={questionsEndRef}></div>
			</>
		);
	};

	return (
		<div className="flex flex-col h-mobile lg:h-full w-full border-8 border-gray-300">
			<div className="flex justify-between items-center text-white p-1 bg-gray-500 shadow-lg mr-5 w-full">
				<div className="flex items-center">
					<h2 className="font-semibold tracking-wider">Preguntas</h2>
				</div>
			</div>
			<div className="flex flex-col bg-gray-200 px-2 overflow-auto h-full">
				<div className=" flex flex-col mt-auto">
					{renderQuestions()}
				</div>
			</div>
		</div>
	);
}
