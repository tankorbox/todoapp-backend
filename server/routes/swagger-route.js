import {swaggerController} from '../controllers';

module.exports = (app, router) => {

	router.route('/swagger')
		.get(swaggerController.index);

};