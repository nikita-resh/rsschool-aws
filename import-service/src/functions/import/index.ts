import { handlerPath } from '@libs/handler-resolver';

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			http: {
				method: 'get',
				cors: true,
				path: '/import',
				authorizer: {
					name: 'tokenAuthorizer',
					arn: 'arn:aws:lambda:eu-west-1:547792367474:function:auth-service-dev-basicAuthorizer',
					identitySource: 'method.request.header.Authorization',
					resultTtlInSeconds: 0,
					type: 'token'
				}
			}
		}
	]
};
