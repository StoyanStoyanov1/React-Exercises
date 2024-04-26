import request from "../lib/request.js"

const baseUrl = 'http://localhost:3030/data/comments';

export const create = async (commentsData) => {

	const result = await request("POST", baseUrl, commentsData);

	return result
}

export const getAll = async (gameID) => {
	const query = new URLSearchParams({ where: `gameId="${gameID}"` });
	const result = await request("GET", `${baseUrl}?${query}`);
	return result;
}

