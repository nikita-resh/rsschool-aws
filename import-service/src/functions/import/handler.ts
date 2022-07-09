import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';

import AWS from 'aws-sdk';
import { APIGatewayProxyEvent } from 'aws-lambda';

const BUCKET = 'bookly-file-store';

export const importProductsFile = async (event: APIGatewayProxyEvent) => {
	const s3 = new AWS.S3({ region: 'eu-west-1' });

	const { name } = event.queryStringParameters;

	if (!name.endsWith('.csv')) {
		return formatJSONResponse(
			{
				message: 'Unexpected error occurred',
				details: 'File format must be .csv'
			},
			422
		);
	}

	const params = {
		Bucket: BUCKET,
		Key: `uploaded/${name}`,
		Expires: 15 * 60,
		ContentType: 'text/csv'
	};

	try {
		const signedURL = await s3.getSignedUrl('putObject', params);
		return formatJSONResponse({ signedURL });
	} catch (err) {
		return formatJSONResponse(
			{
				message: 'Unexpected error occurred',
				details: err.message
			},
			500
		);
	}
};

export const main = middyfy(importProductsFile);
