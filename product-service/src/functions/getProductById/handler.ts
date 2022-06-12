import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { products } from '../../store';

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async event => {
	const product = products.find(product => product.productId === +event.pathParameters.id);
	return formatJSONResponse({
		product
	});
};

export const main = middyfy(getProductById);
