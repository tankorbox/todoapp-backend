import {authController, itemController} from '../controllers';
import {Wrapper} from '../helpers';


module.exports = (app,router) => {

	router
		.route('/items')
		.post([authController.isAuth], Wrapper(itemController.postItem))
		.delete([authController.isAuth], Wrapper(itemController.deleteItems))
		.put([authController.isAuth], Wrapper(itemController.putItems));

	router
		.route('/items/:id')
		.get([authController.isAuth], Wrapper(itemController.getItem))
		.put([authController.isAuth], Wrapper(itemController.putItem));

};