import { handlerPath } from '@libs/handler-resolver';

export default {
	handler: `${handlerPath(__dirname)}/getSwagger.main`,
	events: [
		{
			httpApi: {
				method: 'get',
				path: '/swagger'
			}
		}
	]
};
