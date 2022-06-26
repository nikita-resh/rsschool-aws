import { APIGatewayProxyEvent } from 'aws-lambda';

import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { findAllProducts } from '../../utils/db/products/findAllProducts';

export const getProductsList = async (event: APIGatewayProxyEvent) => {
	console.log('Get products list!');
	console.log('Path params: ', event.pathParameters);
	console.log('Query params: ', event.queryStringParameters);

	try {
		const products = await findAllProducts();
		return formatJSONResponse({
			products
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

export const main = middyfy(getProductsList);
