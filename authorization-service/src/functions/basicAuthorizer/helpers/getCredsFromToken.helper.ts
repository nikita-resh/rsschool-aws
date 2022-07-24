export const getCredsFromToken = (authToken: string) => {
	const [, encodedCreds] = authToken.split(' ');
	const creds = Buffer.from(encodedCreds, 'base64').toString('utf8');
	const [username, password] = creds.split(':');

	return [username, password];
};
