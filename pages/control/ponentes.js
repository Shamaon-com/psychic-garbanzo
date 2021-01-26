import AdminLayout from '../../layouts/adminLayout';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useFormFields } from '../../utils/hooksLib';
import { AuthContext } from '../../utils/functionsLib';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import QuestionList from '../../components/questionList';
import useDynamicRefs from 'use-dynamic-refs';
import * as mutations from '../../config/graphql/mutations';
import * as queries from '../../config/graphql/queries';
import * as subscriptions from '../../config/graphql/subscriptions';

export default function Ponentes() {
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
				//scrollToBottom();
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

	// const scrollToBottom = () => {
	// 	QuestionList.questionsEndRef.current.scrollIntoView();
	// };

	const renderQuestionList = () => {
		return (
			<tbody>
				{questions.map((question, key) => {
					return <div>{question.question}</div>;
				})}
			</tbody>
		);
	};

	const renderMain = () => {
		console.log(questions);
		return (
			<div class=" w-full space-y-8">
				<div
					class="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto relative"
					style={{ height: '100%', maxHeight: '85%' }}
				>
					<QuestionList
						data={questions}
						deleteItem={deleteQuestion}
					/>
				</div>
			</div>
		);
	};

	return <AdminLayout>{renderMain()}</AdminLayout>;
}
