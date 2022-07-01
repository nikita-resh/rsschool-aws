import { getClient } from '../db-client';

const findProductByIdQuery = `
  SELECT p.*, s."count"
  FROM products p
    JOIN stocks s ON p.id = s.product_id AND p.id = $1;
`;

export const findProductById = async (id: string) => {
	const client = getClient();
	await client.connect();

	try {
		const { rows: products } = await client.query(findProductByIdQuery, [id]);

		return products[0];
	} catch (error) {
		console.log('DB error: ', error);
		throw error;
	} finally {
		client.end();
	}
};
