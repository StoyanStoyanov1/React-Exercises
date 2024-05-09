import request from "../lib/request.js";

const baseUrl = 'http://localhost:3030/users';

export const register = async (email, password) => {

	return await request("POST", `${baseUrl}/register`, {
		email,
		password,
	})

};

export const login = async (email, password) => {
	return await request("POST", `${baseUrl}/login`, {
		email,
		password,
	});
}

export const logout = async () => request('GET', `${baseUrl}/logout`);