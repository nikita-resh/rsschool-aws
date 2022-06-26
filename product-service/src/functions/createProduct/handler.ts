import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';

import { APIGatewayProxyEvent } from 'aws-lambda';
import { createProductDto } from 'src/dto/create-product.dto';
import { IProductFE } from 'src/models/IProduct-FE';
import { createProduct as createProductFunc } from 'src/utils/db/products/createProduct';

export const createProduct = async (event: APIGatewayProxyEvent) => {
	const { title, description, author, price, discount, count }: createProductDto = JSON.parse(event.body);
	if (!title || !author || !price || !discount || !count) {
		return formatJSONResponse(
			{
				message: 'Incorrect input',
				details: 'Mandatory non-nullable fields: title, author, price, discount, count'
			},
			400
		);
	}

	try {
		const createdProduct: IProductFE = await createProductFunc({ title, description, author, price, discount, count });

		return formatJSONResponse({
			product: createdProduct
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

export const main = middyfy(createProduct);
