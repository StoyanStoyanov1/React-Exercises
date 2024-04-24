import  request from '../lib/request.js'

const baseUrl = 'http://localhost:3030/jsonstore/games';


export const getAll = async () => {
	const result = await request('GET', baseUrl)

	return Object.values(result)

}

export const getOne = async (gameId) => {
	const result = await request('GET', `${baseUrl}/${gameId}`)

	return result
}
export const create = async (gameData) => {
	const result = await request('POST', baseUrl, gameData);

	return result;
}

