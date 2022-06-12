import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { products } from '../../store';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
	return formatJSONResponse({
		products
	});
};

export const main = middyfy(getProductsList);
