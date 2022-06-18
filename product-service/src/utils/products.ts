import { IProduct } from 'src/IProduct';
import { products } from '../store';

export const findProductById = (id: number): Promise<IProduct> => {
	return new Promise<IProduct>(resolve => resolve(products.find(product => product.id === id)));
};

export const findAllProducts = (): Promise<IProduct[]> => {
	return new Promise<IProduct[]>(resolve => resolve(products));
};
