import { IProductBE } from '../../../models/IProduct-BE';
import { getClient } from '../db-client';

const findAllProductsQuery = `
	SELECT p.*, s.count
  FROM products p
		JOIN stocks s ON p.id = s.product_id;
`;

export const findAllProducts = async (): Promise<IProductBE[]> => {
	const client = getClient();
	await client.connect();

	try {
		const { rows: products } = await client.query(findAllProductsQuery);

		return products;
	} catch (error) {
		console.log('DB error: ', error);
		throw error;
	} finally {
		client.end();
	}
};
