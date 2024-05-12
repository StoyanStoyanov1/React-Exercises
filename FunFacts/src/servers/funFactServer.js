import request from "../lib/request.js";

const baseUrl = 'http://localhost:3030/data/fun-dacts'

export const create = async (data) => {
	return await request('POST', baseUrl, {...data, likes: []});
};

export const getAll = async () => {
	return await request('GET', baseUrl);
};

export const getOne = async (factId) => {
	return await request('GET', `${baseUrl}/${factId}`);
};

export const edit = async (factId, data) => {
	return await request('PUT', `${baseUrl}/${factId}`, data);
};

export const remove = async (factId) => {
	return await request('DELETE', `${baseUrl}/${factId}`);
};