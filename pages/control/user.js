import React, { useState, useEffect } from 'react';

// Amplify
import { API } from 'aws-amplify';
import * as queries from '../../src/graphql/queries';

// Utils
import { useRouter } from 'next/router';

// Components
import AdminLayout from '../../layouts/adminLayout';
import Chat from '../../components/eventoPage/chat';
import Iframe from '../../components/generalComponents/iframe';
import QuestionBox from '../../components/eventoPage/questionBox';
import Tabs from '../../components/containers/tabs';

const User = () => {

    const [data, setData] = useState({});
    const router = useRouter()

	useEffect(() => {

        const { id } = router.query
		console.log(id)
		getEvento(id);
	}, []);

	const getEvento = async (id) => {
        const eventoData = await API.graphql({ query: queries.getEvento, variables: { id: id }});
        console.log(eventoData)
        setData(eventoData.data.getEvento);
	};


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
    
    
	return (
		<>
		</>
	);
}

User.layout = AdminLayout;

export default User;

/** */