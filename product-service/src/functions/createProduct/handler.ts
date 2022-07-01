import { APIGatewayProxyEvent } from 'aws-lambda';

import { createProductDto } from '../../dto/create-product.dto';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { IProductFE } from '../../models/IProduct-FE';
import { createProduct as createProductFunc } from '../../utils/db/products/createProduct';

const validate = (title, description, author, price, discount, count): string[] => {
	const errors: string[] = [];
	if (!title || typeof title !== 'string') {
		errors.push('Title is mandatory and must be a string');
	}
	if (typeof description !== 'string') {
		errors.push('Description must be a string');
	}
	if (!author || typeof author !== 'string') {
		errors.push('Author is mandatory and must be a string');
	}
	if (!price || typeof price !== 'number') {
		errors.push('Price is mandatory and must be a number');
	}
	if (!discount || typeof discount !== 'number') {
		errors.push('Discount is mandatory and must be a number');
	}
	if (!count || typeof count !== 'number') {
		errors.push('Count is mandatory and must be a number');
	}
	return errors;
};

export const createProduct = async (event: APIGatewayProxyEvent) => {
	console.log('Create product!');
	console.log('Body: ', event.body);
	console.log('Path params: ', event.pathParameters);
	console.log('Query params: ', event.queryStringParameters);

	try {
		const { title, description, author, price, discount, count }: createProductDto =
			typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

		const errors = validate(title, description, author, price, discount, count);
		if (errors.length) {
			return formatJSONResponse(
				{
					message: 'Incorrect input',
					details: errors.join('. ')
				},
				400
			);
		}

		const createdProduct: IProductFE = await createProductFunc({
			title,
			description,
			author,
			price,
			discount,
			count
		});

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
