import { S3Event } from 'aws-lambda';
import AWS from 'aws-sdk';
import csv from 'csv-parser';

import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';

export const importFileParser = async (event: S3Event) => {
	for (const record of event.Records) {
		const {
			awsRegion,
			s3: {
				bucket,
				object: { key }
			}
		} = record;
		const s3 = new AWS.S3({ region: awsRegion });

		const params = {
			Bucket: bucket.name,
			Key: key
		};

		const promiseWrap = () =>
			new Promise(() => {
				try {
					const s3Stream = s3.getObject(params).createReadStream();

					const results = [];

					s3Stream
						.pipe(csv())
						.on('data', data => {
							results.push(data);
						})
						.on('error', err => {
							console.log(err);
						})
						.on('end', async () => {
							console.log('Successfully parsed CSV', results);

							await s3
								.copyObject({
									Bucket: bucket.name,
									Key: key.replace('uploaded/', 'parsed/'),
									CopySource: `${bucket.name}/${key}`
								})
								.promise();

							await s3
								.deleteObject({
									Bucket: bucket.name,
									Key: key
								})
								.promise();
						});

					return formatJSONResponse({ message: 'Successfully parsed CSV', data: results });
				} catch (err) {
					return formatJSONResponse(
						{
							message: 'Unexpected error occurred',
							details: err.message
						},
						500
					);
				}
			});

		await promiseWrap();
	}
};

export const main = middyfy(importFileParser);
