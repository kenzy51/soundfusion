import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Musician Registration API',
        version: '1.0.0',
        description: 'API documentation for the Musician Registration System',
    },
    servers: [
        {
            url: 'http://localhost:3000/api', // Update to your deployed API base URL
            description: 'Development server',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./pages/api/*.js'], // Path to the API files
};

export const swaggerSpec = swaggerJSDoc(options);
