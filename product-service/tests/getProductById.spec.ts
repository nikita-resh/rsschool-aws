import { APIGatewayProxyEvent } from 'aws-lambda';

import { getProductById } from '../src/functions/getProductById/handler';
import { findProductById } from '../src/utils/products';

describe('Get product by Id function tests', () => {
	const existingId = '735';
	const notExistingId = '1';
	const incorrectId = '234df';

	it('Should return product for proper Id', async () => {
		const event = {
			pathParameters: {
				id: existingId
			}
		} as unknown as APIGatewayProxyEvent;

		const result = await getProductById(event);
		const { statusCode, body } = result;
		expect(statusCode).toEqual(200);
		const product = await findProductById(+existingId);
		expect(JSON.parse(body).product).toMatchObject(product);
	});

	it('Should return not found error', async () => {
		const event = {
			pathParameters: {
				id: notExistingId
			}
		} as unknown as APIGatewayProxyEvent;

		const result = await getProductById(event);
		const { statusCode } = result;
		expect(statusCode).toEqual(404);
	});

	it('Should return error', async () => {
		const event = {
			pathParameters: {
				id: incorrectId
			}
		} as unknown as APIGatewayProxyEvent;

		const result = await getProductById(event);
		const { statusCode } = result;
		expect(statusCode).toEqual(422);
	});
});
