import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';

import AWS from 'aws-sdk';
import { APIGatewayProxyEvent } from 'aws-lambda';

const BUCKET = 'bookly-file-store';

export const importF = async (event: APIGatewayProxyEvent) => {
	const s3 = new AWS.S3({ region: 'eu-west-1' });

	const { name } = event.queryStringParameters;

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

export const main = middyfy(importF);
