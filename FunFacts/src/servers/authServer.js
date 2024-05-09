const baseUrl = 'http://localhost:3030/users';

import request from "../lib/request.js";

export const login = async (email, password) => {
	const result = await request('POST', `${baseUrl}/login}`, {
		email,
		password,
	}) ;

	return result;
}

export const register = async (email, password) => {
	const result = await request('POST', `${baseUrl}/register`, {
		email,
		password
	});

	return result;
}

