import request from "../lib/request.js";

const baseUrl = 'http://localhost:3030/users';

export const register = async (username, password) => {
	const result = await request("POST", `${baseUrl}/register`, {
		username,
		password,
	});
};

export const login = async (username, password) => {
	await request("POST", `${baseUrl}/login`, {
		username,
		password,
	})
}

export const logout = async () => {
	localStorage.removeItem('accessToken');

	return request('GET', `${baseUrl}/logout`);
}