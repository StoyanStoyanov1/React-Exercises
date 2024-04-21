import * as request from '../lib/request.js'

const baseUrl = 'http://localhost:3030/users/'
export const login = (email, password) => {
	const result = request.post(`${baseUrl}login`, {
		email,
		password,
	});

	return result;
}