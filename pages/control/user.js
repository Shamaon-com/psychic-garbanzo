import React, { useState, useEffect } from 'react';

// Amplify
import { API, graphqlOperation } from "aws-amplify";
import * as subscriptions from "../../src/graphql/subscriptions";

// Utils
import { useModalFields } from '../../utils/hooksLib';
import { graphqlGet, graphqlCreate } from "../../utils/graphqlOperations";

// Components
import ContainerPage from '../../components/containers/containerPage';
import AdminLayout from '../../layouts/adminLayout';
import Modal from '../../components/generalComponents/modal';
import PageCard from '../../components/adminContainers/pageCard';
import List from '../../components/containers/list';
import ListCell from '../../components/adminComponentes/listCell';

export default function UserControl(props) {
	const [users, setUsers] = useState([]);
	const [searchByGroup, setSearchByGroup] = useState('users');
	const [searchString, setSearchString] = useState("");
	
	const [showModal, setShowModal] = useState(false);
	const [isCreating, setIsCreating] = useState(false);

	const [fields, handleFieldChange] = useModalFields({
		email: { type: "default", value: "" },
		username: { type: "default", value: "" },
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
		graphqlGet('listUsers', setUsers);
	}, []);


    const submit = () => {

    }

	const renderMain = () => {

		return (
			<div
				className="overflow-x-scroll bg-white rounded-lg shadow overflow-y-auto relative w-full"
				style={{ height: '90%' }}
			>
            {renderUserCell()}
			</div>
		)
	}


    const renderUserCell = () => {
        console.log(users)
        return users.map((user ) => {
            return (
				< ListCell data={user} />
            )
        })
    }

    
	const renderControls = () => {
		return (
			<div className="w-full" style={{height: "6%"}}>
				<div className=" mb-4 flex justify-between items-center">
					<div className="flex pr-4">
						<input
							type="text"
							name="number"
							value={searchString}
							id="number"
							className="m-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
							onChange={(e) => setSearchString(e.target.value)}
						/>
					</div>
					<div className="flex pr-4 mr-auto">
						<select
							value={searchByGroup}
							className=" block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							onChange={(e) => 
								setSearchByGroup(e.target.value)
							}
						>
							<option value="admins">Administradors</option>
							<option value="ponente">Ponentes</option>
							<option value="users">Usuarios</option>
						</select>
					</div>
					<div className="flex ml-auto">
						<button
							className="h-10 px-5 m-2 text-white bg-purple-600 rounded-lg focus:shadow-outline hover:bg-pruple-400"
							onClick={(e) => {
								setShowModal(true);
							}}
						>
							Añadir
					</button>
					</div>
				</div>
			</div>
		)
	}

	const renderTitle = () => {
		return (
			<div  className="flex w-full flex-row mb-3 py-3 border-b text-center">
				<p className="flex w-1/6 font-bold text-purple-500 ">Username</p>
				<p className="flex  overlfow-hidden w-2/5 font-bold text-purple-500">Email</p>
				<p className="text-center w-1/6 font-bold text-purple-500">Fecha creacion</p>
				<p className="text-center w-1/6 font-bold text-purple-500">Banneado</p>
				<p className="text-center w-1/6 font-bold text-purple-500">Deasctiavado</p>
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
				<PageCard>
					{renderTitle()}
					<List data={renderUserCell()}/>
				</PageCard>
			</ContainerPage>
		</AdminLayout>
	)
}
