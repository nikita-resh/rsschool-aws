import { getProductsList } from '../src/functions/getProductsList/handler';
import { products } from '../src/store';

describe('Get products list tests', () => {
	it('Shoud return proper response with status 200', async () => {
		const result = await getProductsList();
		const { statusCode, body } = result;
		expect(statusCode).toEqual(200);
		expect(JSON.parse(body).products).toMatchObject(products);
	});
});
