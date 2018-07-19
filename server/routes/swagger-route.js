import {swaggerController} from '../controllers';

module.exports = (app, router) => {

	router.route('/swagger')
		.get(swaggerController.home);

	router.route('/swagger.json')
        .get(swaggerController.index);

};