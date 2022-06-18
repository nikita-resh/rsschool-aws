import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { findAllProducts } from '../../utils/products';

export const getProductsList = async () => {
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
