import { APIGatewayProxyResult } from 'aws-lambda';

import swaggerDocument from './swagger.json';

const getSwagger = async (): Promise<APIGatewayProxyResult> => {
	const body = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Products Service</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@3/swagger-ui.css">
    </head>
    <body>
        <div id="swagger"></div>
        <script src="https://unpkg.com/swagger-ui-dist@3/swagger-ui-bundle.js"></script>
        <script>
          SwaggerUIBundle({
            dom_id: '#swagger',
            spec: ${JSON.stringify(swaggerDocument)}
        });
        </script>
    </body>
    </html>
  `;

	return {
		statusCode: 200,
		headers: {
			'Content-Type': 'text/html'
		},
		body
	};
};

export { getSwagger as main };
