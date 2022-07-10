import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';

import { SQSEvent } from 'aws-lambda';
import AWS from 'aws-sdk';
import Joi from 'joi';
import { createProduct } from '../../utils/db/products/createProduct';

const productValidationSchema = Joi.object({
	title: Joi.string().required(),
	description: Joi.string(),
	author: Joi.string().required(),
	price: Joi.number().required(),
	discount: Joi.number().required(),
	count: Joi.number().min(0).required()
});

export const catalogBatchProcess = async (event: SQSEvent) => {
	const SNS = new AWS.SNS();

	try {
		const products = event.Records.map(({ body }) => JSON.parse(body));

		const result = await Promise.all(
			products.map(product => {
				const { value: transformedProduct, error } = productValidationSchema.validate(product);

				if (error) {
					return formatJSONResponse({ message: error.cause, details: error.details }, 422);
				}

				return createProduct(transformedProduct);
			})
		);

		const promiseWrapper = () =>
			new Promise(() => {
				SNS.publish(
					{
						Subject: 'New books!',
						Message: JSON.stringify(products),
						TopicArn: process.env.SNS_TOPIC_ARN
					},
					(error, data) => {
						if (error) {
							console.log(error);
							return;
						}
						console.log(data);
					}
				);
			});

		await promiseWrapper();

		console.log('Successfully imported products', result);
		return formatJSONResponse({ message: 'Successfully imported products' }, 200);
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
