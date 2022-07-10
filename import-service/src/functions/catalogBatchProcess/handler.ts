import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';

import { SQSEvent } from 'aws-lambda';
import AWS from 'aws-sdk';
import { createProduct } from '../../utils/db/products/createProduct';

export const catalogBatchProcess = async (event: SQSEvent) => {
	const SNS = new AWS.SNS();

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
