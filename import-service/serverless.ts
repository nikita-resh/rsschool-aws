import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';

import importProductsFile from '@functions/import';
import importFileParser from '@functions/importFileParser';
import catalogBatchProcess from '@functions/catalogBatchProcess';

dotenv.config();

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
			},
			{
				Effect: 'Allow',
				Action: 'sqs:*',
				Resource: [
					{
						'Fn::GetAtt': ['catalogItemsQueue', 'Arn']
					}
				]
			},
			{
				Effect: 'Allow',
				Action: 'sns:*',
				Resource: [
					{
						Ref: 'createProductTopic'
					}
				]
			}
		],
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
			NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
			PG_HOST: process.env.PG_HOST,
			PG_PORT: process.env.PG_PORT,
			PG_DATABASE: process.env.PG_DATABASE,
			PG_USERNAME: process.env.PG_USERNAME,
			PG_PASSWORD: process.env.PG_PASSWORD,
			IMPORT_QUEUE_URL: {
				Ref: 'catalogItemsQueue'
			},
			SNS_TOPIC_ARN: {
				Ref: 'createProductTopic'
			}
		}
	},
	// import the function via paths
	functions: { importProductsFile, importFileParser, catalogBatchProcess },
	package: { individually: true },
	resources: {
		Resources: {
			catalogItemsQueue: {
				Type: 'AWS::SQS::Queue',
				Properties: {
					QueueName: 'catalogItemsQueue'
				}
			},
			createProductTopic: {
				Type: 'AWS::SNS::Topic',
				Properties: {
					TopicName: 'createProductTopic'
				}
			},
			SNSBigShipment: {
				Type: 'AWS::SNS::Subscription',
				Properties: {
					Protocol: 'email',
					Endpoint: process.env.EMAIL_ENDPOINT_1,
					TopicArn: {
						Ref: 'createProductTopic'
					},
					FilterPolicy: {
						shipmentType: ['Big']
					}
				}
			},
			SNSSmallShipment: {
				Type: 'AWS::SNS::Subscription',
				Properties: {
					Protocol: 'email',
					Endpoint: process.env.EMAIL_ENDPOINT_2,
					TopicArn: {
						Ref: 'createProductTopic'
					},
					FilterPolicy: {
						shipmentType: ['Small']
					}
				}
			}
		}
	},
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
