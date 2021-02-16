import AdminLayout from '../../layouts/adminLayout';
import React, { useState, useEffect } from 'react';
import { useFormFields } from '../../utils/hooksLib';
import { Auth, API } from 'aws-amplify';
import ContainerPage from '../../components/containers/containerPage';
import Modal from '../../components/generalComponents/modal';


export default function UserControl(props) {
	const [users, setUsers] = useState([]);
	const [index, setIndex] = useState(null);
	const [isCreating, setIsCreating] = useState(false);
	const [searchByGroup, setSearchByGroup] = useState('users');
	const [showModal, setShowModal] = useState(false);


	let nextToken;

	const [fields, handleFieldChange] = useFormFields({
		email: { type: "default", value: "" },
		name: { type: "default", value: "" },
		group: { type: "select", value: "", 
			options: [
				{ key: "user", text: "Usuario" }, 
				{ key: "ponente", text: "Ponente" },
				{ key: "admin", text: "Administrador" }
			] 
		},
		number: { type: "default", value: "" },
		password: { type: "default", value: "" },
	});

	useEffect(() => {
		listUsers();
	}, [searchByGroup]);


	async function listUsers() {

		let apiName = 'AdminQueries';
		let path = '/listUsersInGroup';
		let myInit = {
			queryStringParameters: {
				groupname: searchByGroup,
				limit: 10,
				token: nextToken,
			},
			headers: {
				'Content-Type': 'application/json',
				Authorization: `${(await Auth.currentSession())
					.getAccessToken()
					.getJwtToken()}`,
			},
		};

		const { NextToken, ...rest } = await API.get(apiName, path, myInit);
		nextToken = NextToken;
		setUsers(rest.Users);
	}


	async function addToGroup() {
		let group;
		if (fields.group === 'Ponente') {
			group = 'ponente';
		}

		if (fields.group === 'Administrador') {
			group = 'admins';
		}

		if (fields.group === 'Usuario') {
			group = 'users';
		}

		let apiName = 'AdminQueries';
		let path = '/addUserToGroup';
		let myInit = {
			body: {
				username: fields.email,
				groupname: group,
			},
			headers: {
				'Content-Type': 'application/json',
				Authorization: `${(await Auth.currentSession())
					.getAccessToken()
					.getJwtToken()}`,
			},
		};
		return await API.post(apiName, path, myInit);
	}

	async function disableUser() {
		if (index === null) {
			alert('Seleccione un usuario');
		}
		console.log(users[index].Username);
		let apiName = 'AdminQueries';
		let path = '/disableUser';
		let myInit = {
			body: {
				username: users[index].Username,
			},
			headers: {
				'Content-Type': 'application/json',
				Authorization: `${(await Auth.currentSession())
					.getAccessToken()
					.getJwtToken()}`,
			},
		};
		return await API.post(apiName, path, myInit);
	}

	const submit = () => {

	}

	const parseFields = (user) => {

		const returnObject = {}

		if (user.Attributes) {
			user.Attributes.map((data) => {
				returnObject[data.Name] = data.Value
			})
		}
		return returnObject;
	}


	const renderUserCell = () => {

		const keys = ["name", "email", "phone_number", "phone_number_verified", "email_verified"]

		return (
			<tbody>
				{users.map((user, index) => {
					const attributes = parseFields(user);
					return (
						<tr key={index}>
							<td className="border-dashed border-t border-gray-200 px-3">
								<label className="text-teal-500 inline-flex justify-between items-center hover:bg-gray-200 px-2 py-2 rounded-lg cursor-pointer">
									<input
										type="checkbox"
										className="form-checkbox rowCheckbox focus:outline-none focus:shadow-outline"
										onClick={(e) => {
											setIndex(index);
										}}
									/>
								</label>
							</td>
							{keys.map((key) => {
								return (
									<td className="border-dashed border-t border-gray-200">
										<span className="text-gray-700 px-6 py-3 flex items-center">
											{attributes[key]}
										</span>
									</td>
								)
							})}
						</tr>
					);
				})}
			</tbody>
		);
	};

	const renderKey = () => {
		//console.log(userTable.headings)

		const keys = ["name", "email", "phone number", "phone verified", "email verifed"]

		return (
			<>
				{keys.map((item, key) => {
					return (
						<th className="bg-gray-100 sticky top-0 border-b border-gray-200 px-6
								py-2 text-gray-600 font-bold tracking-wider uppercase text-xs">
							{item}
						</th>
					);
				})}
			</>
		);
	};



	const renderMain = () => {
		return (
			<div
				className="overflow-x-scroll bg-white rounded-lg shadow overflow-y-auto relative w-full"
				style={{ height: '90%' }}
			>
				<table className="border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative">
					<thead>
						<tr className="text-left">
							<th className="py-2 px-3 sticky top-0 border-b border-gray-200 bg-gray-100">
								<label className="text-teal-500 inline-flex justify-between items-center hover:bg-gray-200 px-2 py-2 rounded-lg cursor-pointer">
									<input
										type="checkbox"
										className="form-checkbox-disabled"
										disabled
									/>
								</label>
							</th>
							{renderKey()}
						</tr>
					</thead>
					{renderUserCell()}
				</table>
			</div>
		)
	}


	const renderControls = () => {
		return (
			<div className=" w-full space-y-8">
				<div className=" mb-4 flex justify-between items-center">
					<div className="flex pr-4">
						<input
							type="text"
							name="number"
							value={fields.number}
							id="number"
							className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
							onChange={handleFieldChange}
						/>
					</div>
					<div className="flex pr-4 mr-auto">
						<select
							value={searchByGroup}
							className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							onChange={(e) => 
								setSearchByGroup(e.target.value)
							}
						>
							<option value="admins">Administrador</option>
							<option value="ponente">Ponente</option>
							<option value="users">Usuario</option>
						</select>
					</div>
					<div className="flex pr-4 ml-auto">
						<button
							className="h-10 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800"
							onClick={(e) => {
								setShowModal(true);
							}}
						>
							+
					</button>
					</div>
					<div className="flex pr-4">
						<button
							className="h-10 px-5 m-2 text-indigo-100 transition-colors 
								duration-150 bg-red-700 rounded-lg focus:shadow-outline hover:bg-red-800"
							onClick={(e) => {
								disableUser();
							}}
						>
							-
					</button>
					</div>
				</div>
			</div>
		)
	}


	return (
		<AdminLayout>
			<ContainerPage>
				<Modal
					element={"Usuario"}
					fields={fields}
					handleFieldChange={handleFieldChange}
					submit={submit}
					showModal={showModal}
					setShowModal={setShowModal}
					isCreating={isCreating}
				/>
				{renderControls()}
				{renderMain()}
			</ContainerPage>
		</AdminLayout>
	)
}
