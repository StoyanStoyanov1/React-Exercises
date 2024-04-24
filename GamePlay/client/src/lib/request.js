const buildOptions = (data) => {
	const options = {};

	if (data) {
		options.body = JSON.stringify(data);
		options.headers = {'content-type': 'application/json'};
	}

	return options
}

export default async function request (method, url, data) {
	const response = await fetch(url, {
		method,
		...buildOptions(data)
	});

	const result = await response.json();

	return result;
}
