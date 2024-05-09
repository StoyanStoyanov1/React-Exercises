import request from "../lib/request.js";

const baseUrl = 'http://localhost:3030/data/characters';

export const createCharacter = async (dataCharacter) => {
	const result = await request('POST', baseUrl, dataCharacter);

	return result;
}

export const getAll = async () => {
	const result = await request('GET', baseUrl);

	return result;
}

export const getOne = async (id) => {
	const result = await request('GET', `${baseUrl}/${id}`);

	return result
}