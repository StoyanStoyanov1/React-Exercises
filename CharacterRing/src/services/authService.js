import request from "../lib/request.js";

const baseUrl = 'http://localhost:3030/users';

export const register = async (email, password) => {

	const result = await request("POST", `${baseUrl}/register`, {
		email,
		password,
	});

	return result;
};

export const login = async (email, password) => {
	await request("POST", `${baseUrl}/login`, {
		email,
		password,
	})
}

export const logout = async () => {
	localStorage.removeItem('accessToken');

	return request('GET', `${baseUrl}/logout`);
}