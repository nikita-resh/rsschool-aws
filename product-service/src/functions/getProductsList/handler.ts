import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { products } from '../../store';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
	try {
		return formatJSONResponse({
			products
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

export const main = middyfy(getProductsList);
