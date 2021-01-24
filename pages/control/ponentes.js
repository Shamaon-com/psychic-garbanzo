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

	// const scrollToBottom = () => {
	// 	QuestionList.questionsEndRef.current.scrollIntoView();
	// };

	/** 
  <div class="flex pr-4 ml-auto">
  <button class="h-10 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800">
    Subir CSV
  </button>
</div>
*/
	const renderQuestionCell = () => {
		const keys = ['sub', 'phone_number_verified', 'email_verified'];

		return (
			<tbody>
				{questions.map((question, key) => {
					return (
						<tr key={key}>
							<td class="border-dashed border-t border-gray-200 px-3">
								<label class="text-teal-500 inline-flex justify-between items-center hover:bg-gray-200 px-2 py-2 rounded-lg cursor-pointer">
									<input
										type="checkbox"
										class="form-checkbox rowCheckbox focus:outline-none focus:shadow-outline"
										onClick={(e) => {
											setIndex(key);
										}}
									/>
								</label>
							</td>
							{question.Attributes.map((attribute, key) => {
								if (!keys.includes(attribute.Name)) {
									return (
										<td class="border-dashed border-t border-gray-200">
											<span class="text-gray-700 px-6 py-3 flex items-center">
												{attribute.Value}
											</span>
										</td>
									);
								}
							})}
						</tr>
					);
				})}
			</tbody>
		);
	};
	const renderKey = () => {
		//console.log(userTable.headings)
		const keys = ['sub', 'phone_number_verified', 'email_verified'];
		if (questions[0] !== undefined) {
			return (
				<>
					{questions[0].Attributes.map((item, key) => {
						if (!keys.includes(item.Name)) {
							return (
								<th class="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-2 text-gray-600 font-bold tracking-wider uppercase text-xs">
									{item.Name}
								</th>
							);
						}
					})}
				</>
			);
		}
	};
	const renderMain = () => {
		return (
			<>
				<div class=" w-full space-y-8">
					<div
						class="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto relative"
						style={{ height: '85%' }}
					>
						<table class="border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative">
							<thead>
								<tr class="text-left">
									<th class="py-2 px-3 sticky top-0 border-b border-gray-200 bg-gray-100">
										<label class="text-teal-500 inline-flex justify-between items-center hover:bg-gray-200 px-2 py-2 rounded-lg cursor-pointer">
											<input
												type="checkbox"
												class="form-checkbox focus:outline-none focus:shadow-outline"
											/>
										</label>
									</th>
									{renderKey()}
								</tr>
							</thead>
							{renderQuestionCell()}
						</table>
					</div>
				</div>
				)
			</>
		);
	};
	return <AdminLayout>{renderMain()}</AdminLayout>;
	// return (
	// 	<AdminLayout>
	// 		<QuestionList
	// 			questions={questions}
	// 			question={question}
	// 			authContext={authContext}
	// 			showDelete={showDelete}
	// 			hideDelete={hideDelete}
	// 			getRef={getRef}
	// 			setRef={setRef}
	// 		/>
	// 	</AdminLayout>
	// );
}
