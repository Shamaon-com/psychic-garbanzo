import React, { useState, useEffect } from 'react';
import DeleteButton from '../adminComponentes/deleteButton';



export default function QuestionList({ ...props }) {
	const [array, setArray] = useState([]);


	useEffect(() => {

		props.data !== undefined && setArray(props.data);
		console.log(props.data)
	}, [props.data]);

	return (
		<div className="w-full h-full overflow-auto mb-2">
			{array.length === 0 ? (
				<div className={"w-full h-full flex justify-center items-center"}>
					Aquí aparecerán las preguntas
				</div>
			) : (
				<>
					{array.map((item, key) => {
						return (
							<div key={key} id={item.id} className="relative bg-white text-gray-700 p-4 self-start m-3 border-2 border-gray">
								<DeleteButton id={item.id} item={"Question"} />
								<div className="font-medium mb-1">{item.question}</div>
								<div className="text-xs font-light font-sans">
									{item.user.split('@')[0]} -{' '}
									{new Date(item.createdAt).toLocaleTimeString()}
								</div>
							</div>
						);
					})}
				</>
			)}

		</div>
	);
}
