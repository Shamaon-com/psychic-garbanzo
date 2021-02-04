import React, { useState, useContext } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import * as mutations from '../../src/graphql/mutations';

import { AuthContext } from '../../utils/functionsLib';



export default function QuestionBox() {
	const [question, setQuestion] = useState('');
	const authContext = useContext(AuthContext);

	const createQuestion = (e) => {
		if (question === '') {
			alert('Pregunta vacia');
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
		alert('Pregunta enviada');
	};

	return (
		<div  className="flex flex-col h-mobile lg:h-52 w-full border-8 border-gray-300">
			<div  className="flex justify-between items-center text-white p-1 bg-gray-500 shadow-lg mr-5 w-full">
				<div  className="flex items-center">
					<h2  className="font-semibold tracking-wider">
						Escribe tu pregunta
					</h2>
				</div>
			</div>

			<div  className="relative bg-white h-full flex flex-col">
				<textarea
					type="text"
					name="question"
					value={question}
					placeholder="Pregunta"
					onChange={(e) => {
						setQuestion(e.target.value);
					}}
					 className="py-2 border-none focus:border-none focus:outline-none focus:border-transparent w-full resize-none h-3/4 flex-row"
				/>
				<button
					 className="absolute right-0 bottom-0 text-blue-600 bg-white  hover:text-blue-500 m-1 
                        px-3 py-1 w-auto transistion-color duration-100 focus:outline-none flex-row"
					onClick={(e) => {
						createQuestion(e);
					}}
				>
					Send
				</button>
			</div>
		</div>
	);
}
