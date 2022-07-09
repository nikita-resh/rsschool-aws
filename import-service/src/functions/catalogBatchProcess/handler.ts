import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';

import { SQSEvent } from 'aws-lambda';
import { createProduct } from '../../utils/db/products/createProduct';

export const catalogBatchProcess = async (event: SQSEvent) => {
	try {
		const products = event.Records.map(({ body }) => JSON.parse(body));
		const result = await Promise.all(
			products.map(product =>
				createProduct({
					title: String(product.title),
					description: String(product.description),
					author: String(product.author),
					price: Number(product.price),
					discount: Number(product.discount),
					count: Number(product.count)
				})
			)
		);

		console.log('Successfully imported products', result);
	} catch (err) {
		console.log(err);
		return formatJSONResponse(
			{
				message: 'Unexpected error occurred',
				details: err.message
			},
			500
		);
	}
};

export const main = middyfy(catalogBatchProcess);
