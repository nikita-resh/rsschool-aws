import { createProductDto } from 'src/dto/create-product.dto';
import { IProduct as ProductBE } from 'src/models/IProduct-BE';
import { IStock } from 'src/models/IStock-BE';
import { getClient } from '../db-client';

const createProductRecordQuery = `
  INSERT INTO products (title, description, author, price, discount) VALUES
  ($1, $2, $3, $4, $5);
`;

const createStockRecordQuery = `
	INSERT INTO stocks (product_id, count) VALUES
	($1, $2);
`;

export const createProduct = async ({ title, description, author, price, discount, count }: createProductDto) => {
	const client = getClient();
	await client.connect();

	try {
		const { rows: productRows } = await client.query<ProductBE>(createProductRecordQuery, [
			title,
			description,
			author,
			price,
			discount
		]);
		const product: ProductBE = productRows[0];

		const { rows: stockRows } = await client.query<IStock>(createStockRecordQuery, [product.id, count]);
		const stock: IStock = stockRows[0];

		return { ...product, count: stock.count };
	} catch (error) {
		console.log('DB error: ', error);
	} finally {
		client.end();
	}
};
