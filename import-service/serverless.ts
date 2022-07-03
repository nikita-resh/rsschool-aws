import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/import';
import importFileParser from '@functions/importFileParser';

const serverlessConfiguration: AWS = {
	service: 'import-service',
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
		iamRoleStatements: [
			{
				Effect: 'Allow',
				Action: ['s3:listBucket'],
				Resource: ['arn:aws:s3:::bookly-file-store']
			},
			{
				Effect: 'Allow',
				Action: ['s3:*'],
				Resource: ['arn:aws:s3:::bookly-file-store/*']
			}
		],
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
			NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000'
		}
	},
	// import the function via paths
	functions: { importProductsFile, importFileParser },
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
