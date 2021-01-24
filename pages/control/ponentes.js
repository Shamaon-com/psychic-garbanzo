import AdminLayout from '../../layouts/adminLayout';
import React, { useState, useEffect, useContext } from 'react';
import { useFormFields } from '../../utils/hooksLib';
import { AuthContext } from '../../utils/functionsLib';
import { Auth, API } from 'aws-amplify';
import QuestionList from '../../components/questionList';

export default function ponentes() {
	return (
		<div>
			<QuestionList />
		</div>
	);
}
