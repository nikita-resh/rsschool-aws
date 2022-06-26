import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';

import { APIGatewayProxyEvent } from 'aws-lambda';
import { findProductById } from '../../utils/db/products/findProductById';

export const getProductById = async (event: APIGatewayProxyEvent) => {
	console.log('Get product by Id!');
	console.log('Path params: ', event.pathParameters);
	console.log('Query params: ', event.queryStringParameters);

	const { id } = event.pathParameters;

	try {
		if (!id || typeof id !== 'string') {
			return formatJSONResponse({ errors: [{ message: 'Incorrect Id was provided' }] }, 422);
		}

		const product = await findProductById(id);
		if (!product) {
			return formatJSONResponse({ message: 'Product not found' }, 404);
		}

		return formatJSONResponse({
			product
		});
	} catch (e) {
		return formatJSONResponse(
			{
				message: 'Unexpected error occurred',
				details: e.message
			},
			500
		);
	}
};

export const main = middyfy(getProductById);
