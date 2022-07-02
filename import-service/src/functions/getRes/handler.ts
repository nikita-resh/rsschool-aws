import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';

import { APIGatewayProxyEvent } from 'aws-lambda';

export const getProductById = async (event: APIGatewayProxyEvent) => {
	console.log('Get product by Id!');
	console.log('Path params: ', event.pathParameters);
	console.log('Query params: ', event.queryStringParameters);

	try {
		return formatJSONResponse({ status: 'ok', message: 'How are you?' });
	} catch (err) {
		return formatJSONResponse(
			{
				message: 'Unexpected error occurred',
				details: err.message
			},
			500
		);
	}
};

export const main = middyfy(getProductById);
