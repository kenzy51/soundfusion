import { swaggerSpec } from '@/lib/swagger';
import swaggerUi from 'swagger-ui-express';

const swaggerDocsHandler = (req, res) => {
    if (req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(swaggerSpec));
    } else {
        res.status(405).end('Method Not Allowed');
    }
};

export default swaggerDocsHandler;

export const config = {
    api: {
        bodyParser: false,
    },
};
