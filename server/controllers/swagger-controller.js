import Path from 'path';
import SwaggerJSDoc from 'swagger-jsdoc';
import {swaggerConfig} from '../config/index';

export default class SwaggerController {

    index = async (req, res) => {

        const swaggerDefinition = {
            info: {
                title: swaggerConfig.APP_NAME,
                version: swaggerConfig.APP_VERSION,
                description: swaggerConfig.APP_DESCRIPTION
            },
            host: swaggerConfig.APP_HOST,
            basePath: '/api'
        };

        const swaggerOptions = {
            swaggerDefinition: swaggerDefinition,
            // Path to the API docs
            apis: [
                Path.join(__dirname, '..', 'routes', '*.js'),
                Path.join(__dirname, '..', 'docs', '*.js'),
                Path.join(__dirname, '..', 'docs', '*.yml'),
                Path.join(__dirname, '..', 'docs', '*.yaml')
            ]
        };
        const swaggerSpec = SwaggerJSDoc(swaggerOptions);
        return res.json(swaggerSpec);
    };

    home = async (req, res) => {
        const SWAGGER_URL = swaggerConfig.SWAGGER_URL;
        res.render('swagger/index', {swaggerUrl: SWAGGER_URL});
    };

}