import { importProductsFile } from '../functions/import/handler';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const TEST_FILE_NAME = 'test.csv';
const INCORRECT_FILE_NAME = 'incorrect.png';

describe('importProductsFile', () => {
	it('Should return presigned url', async () => {
		const event: APIGatewayProxyEvent = {
			queryStringParameters: { name: TEST_FILE_NAME }
		} as any;

		const { statusCode, body } = (await importProductsFile(event)) as APIGatewayProxyResult;

		const { signedURL } = JSON.parse(body);

		expect(statusCode).toEqual(200);
		expect(signedURL).toBeDefined();
		expect(signedURL).toContain(TEST_FILE_NAME);
	});

	it('Should return error on inncorrect type', async () => {
		const event: APIGatewayProxyEvent = {
			queryStringParameters: { name: INCORRECT_FILE_NAME }
		} as any;

		const { statusCode, body } = (await importProductsFile(event)) as APIGatewayProxyResult;

		const { details } = JSON.parse(body);

		expect(statusCode).toEqual(422);
		expect(details).toEqual('File format must be .csv');
	});
});
