import request from "../lib/request.js";

const baseUrl = 'http://localhost:3030/data/characters';

export const createCharacter = async (dataCharacter) => {
	const result = await request('POST', baseUrl, dataCharacter);

	return result;
}