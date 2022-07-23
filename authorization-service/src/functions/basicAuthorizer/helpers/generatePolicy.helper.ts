import { APIGatewayAuthorizerResult } from 'aws-lambda';

export type effectType = 'Allow' | 'Deny';

export const generatePolicy = (
	principalId: string,
	Effect: effectType,
	Resource: string
): APIGatewayAuthorizerResult => ({
	principalId,
	policyDocument: {
		Version: '2012-10-17',
		Statement: [
			{
				Action: 'execute-api:Invoke',
				Effect,
				Resource
			}
		]
	}
});
