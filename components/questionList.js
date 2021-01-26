import React, { useState, useEffect, useRef, useContext } from 'react';
import { a, API, graphqlOperation } from 'aws-amplify';
import * as mutations from '../config/graphql/mutations';
import * as queries from '../config/graphql/queries';
import * as subscriptions from '../config/graphql/subscriptions';
import { AuthContext } from '../utils/functionsLib';

import useDynamicRefs from 'use-dynamic-refs';
import Ponentes from '../pages/control/ponentes';

export default function QuestionList({ ...props }) {
	const [array, setArray] = useState([]);
	const [getRef, setRef] = useDynamicRefs();
	const questionsEndRef = useRef(null);

	const authContext = useContext(AuthContext);

	useEffect(() => {
		console.log(props);
		setArray(props.data);
	}, [props.data]);

	return (
		<>
			{array.map((item, key) => {
				let classVar =
					'bg-white text-gray-700 p-4 self-start m-3 rounded-xl shadow-lg';
				return (
					<div key={key} id={item.id} className={classVar}>
						<svg
							style={{ width: '20px' }}
							className="ml-auto p-0.5 cursor-pointer"
							viewBox="0 0 512 512"
							width="512pt"
							xmlns="http://www.w3.org/2000/svg"
							onClick={props.deleteItem}
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
						<div className="font-medium mb-1">{item.question}</div>
						<div className="text-xs font-light font-sans">
							{item.user.split('@')[0]} -{' '}
							{new Date(item.createdAt).toLocaleTimeString()}
						</div>
					</div>
				);
			})}
		</>
	);
}
