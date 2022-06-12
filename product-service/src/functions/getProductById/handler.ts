import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { products } from '../../store';

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async ({ pathParameters: { id } }) => {
	try {
		if (!id || typeof id !== 'string' || isNaN(Number(id))) {
			return formatJSONResponse({ errors: [{ message: 'Incorrect Id was provided' }] }, 422);
		}

		const product = products.find(product => product.id === +id);
		if (!product) {
			return formatJSONResponse({ errors: [{ message: 'Product not found' }] }, 404);
		}

		return formatJSONResponse({
			product
		});
	} catch (e) {
		return formatJSONResponse(
			{
				errors: [
					{
						message: 'Unexpected error occurred',
						details: e.message
					}
				]
			},
			500
		);
	}
};

export const main = middyfy(getProductById);
