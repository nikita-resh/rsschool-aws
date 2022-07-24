import { APIGatewayAuthorizerCallback, APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import { effectType, generatePolicy } from './helpers/generatePolicy.helper';
import { getCredsFromToken } from './helpers/getCredsFromToken.helper';

export const basicAuthorizer = async (
	event: APIGatewayTokenAuthorizerEvent,
	_ctx: any,
	cb: APIGatewayAuthorizerCallback
) => {
	console.log('Event: ', JSON.stringify(event));

	if (event.type !== 'TOKEN' || !event.authorizationToken) {
		cb('Unauthorized');
	}

	try {
		const authToken = event.authorizationToken;
		const [username, password] = getCredsFromToken(authToken);

		console.log('Username: ', username, 'Password: ', password);

		const storedPassword = process.env[username];

		const effect: effectType = username && password && storedPassword === password ? 'Allow' : 'Deny';

		const policy = generatePolicy(username, effect, event.methodArn);

		console.log('Policy: ', JSON.stringify(policy));

		cb(null, policy);
	} catch (error) {
		cb(`Unauthorized: ${error}`);
	}
};
