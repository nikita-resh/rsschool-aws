import { APIGatewayProxyResult, SQSEvent, SQSRecord } from 'aws-lambda';
import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';

jest.mock('../utils/db/products/createProduct');

import * as catalogBatchProcess from '../functions/catalogBatchProcess/handler';

const recordBase: SQSRecord = {
	messageId: '69e657f2-b159-4cf1-abd1-d8b11f1cca2f',
	receiptHandle: 'ABC',
	body: JSON.stringify({
		title: 'Product 1',
		description: 'Product 1 description',
		author: 'Author 1',
		price: '100',
		discount: 10,
		count: 10
	}),
	attributes: {
		ApproximateReceiveCount: '1',
		AWSTraceHeader: 'ABC',
		SentTimestamp: '1657467671362',
		SenderId: 'ABC',
		ApproximateFirstReceiveTimestamp: '1657467681362'
	},
	messageAttributes: {},
	md5OfBody: 'ABC',
	eventSource: 'aws:sqs',
	eventSourceARN: 'arn',
	awsRegion: 'eu-west-1'
};

describe('importProductsFile', () => {
	it('Should create product', async () => {
		AWSMock.setSDKInstance(AWS);
		AWSMock.mock('SNS', 'publish', 'success');

		const event: SQSEvent = {
			Records: [recordBase]
		};

		const { statusCode } = await catalogBatchProcess.catalogBatchProcess(event);

		console.log(await catalogBatchProcess.catalogBatchProcess(event));

		expect(statusCode).toEqual(200);
	});

	it('Shuld not pass validation', async () => {
		jest.setTimeout(20000);

		const event: SQSEvent = {
			Records: [
				{
					...recordBase,
					body: JSON.stringify({
						title: 'Product 1',
						description: 'Product 1 description'
					})
				}
			]
		};

		const { statusCode } = (await catalogBatchProcess.catalogBatchProcess(event)) as APIGatewayProxyResult;

		expect(statusCode).toEqual(422);
	});
});
