import request from "../lib/request.js"

const baseUrl = 'http://localhost:3030/jsonstore/comments';

export const create = async (commentsData) => {
	const result = await request("POST", baseUrl, commentsData);

	return result
}

export const getAll = async () => {
	const result = await request("GET", baseUrl);

	return Object.values(result)
}
