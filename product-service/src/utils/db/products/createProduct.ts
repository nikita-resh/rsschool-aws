import { createProductDto } from '../../../dto/create-product.dto';
import { IProductBE } from '../../../models/IProduct-BE';
import { IProductFE } from '../../../models/IProduct-FE';
import { IStock } from '../../../models/IStock';
import { getClient } from '../db-client';

const createProductRecordQuery = `
  INSERT INTO products (title, description, author, price, discount) VALUES
  ($1, $2, $3, $4, $5)
	RETURNING *;
`;

const createStockRecordQuery = `
	INSERT INTO stocks (product_id, count) VALUES
	($1, $2)
	RETURNING *;
`;

export const createProduct = async ({
	title,
	description,
	author,
	price,
	discount,
	count
}: createProductDto): Promise<IProductFE> => {
	const client = getClient();
	await client.connect();

	try {
		await client.query('BEGIN');

		const { rows: productRows } = await client.query<IProductBE>(createProductRecordQuery, [
			title,
			description,
			author,
			price,
			discount
		]);
		const product: IProductBE = productRows[0];

		const { rows: stockRows } = await client.query<IStock>(createStockRecordQuery, [product.id, count]);
		const stock: IStock = stockRows[0];

		await client.query('COMMIT');
		return { ...product, count: stock.count };
	} catch (error) {
		console.log('DB error: ', error);
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.end();
	}
};
