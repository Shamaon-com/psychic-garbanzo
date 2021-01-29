import AdminLayout from '../../layouts/adminLayout';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../../utils/functionsLib';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import QuestionList from '../../components/questionList';
import useDynamicRefs from 'use-dynamic-refs';


import * as mutations from '../../config/graphql/mutations';
import * as queries from '../../config/graphql/queries';
import * as subscriptions from '../../config/graphql/subscriptions';


export default function Ponentes() {
	const [questions, setQuestions] = useState([]);
	const lentgh = questions.length;
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
			// scrollToBottom();
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

	// const renderQuestionList = () => {
	// 	return (
	// 		<tbody class="bg-white text-gray-700 p-4 self-start m-3 rounded-xl shadow-lg">
	// 			{questions.map((question, key) => {
	// 				return <div>{question.question}</div>;
	// 			})}
	// 		</tbody>
	// 	);
	// };

	const renderMain = () => {
		return questions.length === 0 ? (
			<div class="m-auto">
				<div class="bg-white shadow-xl rounded-xl">
					<div class="font-sans text-xl text-gray-600 p-5">
						Aquí aparecerán las preguntas
						<div ref={questionsEndRef}></div>
					</div>
				</div>
			</div>
		) : (
			<div class=" w-full space-y-8">
				<div
					class="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto relative"
					style={{ height: '100%', maxHeight: '75%' }}
				>
					<QuestionList
						data={questions}
						deleteItem={deleteQuestion}
					/>
					<div ref={questionsEndRef}></div>
				</div>
			</div>
		);
	};

	return <AdminLayout>{renderMain()}</AdminLayout>;
}
