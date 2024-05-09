const buildOptions = (data) => {
	const options = {};

	if (options) {
		options.body = JSON.stringify(data)
		options.headers = {'content-type': 'application/json'};
	}

	const token = localStorage.getItem('accessToken');

	if (token) {
		options.headers = {
			...options.headers,
			'X-Authorization': token,
		}
	}

	return options;
}

export default async function request(method, url, data) {
	const response = await fetch(url, {
		method,
		...buildOptions(data)
	});

	if (response.status === 204) {
		return {}
	}

	const result = await response.json();

	if (!response.ok) {
		throw result
	}

	return result;
}