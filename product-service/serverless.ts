import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';

import swagger from '@functions/swagger';
import createProduct from '@functions/createProduct';
import getProductById from '@functions/getProductById';
import getProductsList from '@functions/getProductsList';

dotenv.config();

const serverlessConfiguration: AWS = {
	service: 'product-service',
	frameworkVersion: '3',
	plugins: ['serverless-webpack'],
	provider: {
		name: 'aws',
		runtime: 'nodejs14.x',
		region: 'eu-west-1',
		httpApi: {
			cors: true
		},
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true
		},
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
			NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
			PG_HOST: process.env.PG_HOST,
			PG_PORT: process.env.PG_PORT,
			PG_DATABASE: process.env.PG_DATABASE,
			PG_USERNAME: process.env.PG_USERNAME,
			PG_PASSWORD: process.env.PG_PASSWORD
		}
	},
	// import the function via paths
	functions: { swagger, createProduct, getProductById, getProductsList },
	package: { individually: true },
	custom: {
		esbuild: {
			bundle: true,
			minify: false,
			sourcemap: true,
			exclude: ['aws-sdk'],
			target: 'node14',
			define: { 'require.resolve': undefined },
			platform: 'node',
			concurrency: 10
		},
		webpack: {
			webpackConfig: './webpack.config.js',
			includeModules: true
		}
	}
};

module.exports = serverlessConfiguration;
