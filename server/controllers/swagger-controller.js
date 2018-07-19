import HTTPStatus from 'http-status';

export default class SwaggerController {

	index = async(req, res) => {
		const SWAGGER_URL = '/swagger.json';
		res.render('swagger/index', {swaggerUrl: SWAGGER_URL});
	};

}