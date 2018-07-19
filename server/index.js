import Express from 'express';
import Cors from 'cors';
import Helmet from 'helmet';
import BodyParser from 'body-parser';
import FileUpload from 'express-fileupload';
import Path from 'path';
import ErrorHandler from './middlewares/error-handler';
import Routers from './routes/index';

const app = Express();

app
	.use(Helmet())
	.use(Helmet.referrerPolicy({ policy: 'same-origin' }))
	.use(FileUpload({
		limits: { fileSize: 5 * 1024 * 1024 }
	}))
	.use(Cors())
	.use(BodyParser.json())
	.use(BodyParser.urlencoded({extended: true}))
	.use(Express.static(Path.resolve(__dirname, '..', 'public'), {maxAge: 31557600000}))
	.use('/api', Routers)
	.use(ErrorHandler)
	.set('views', Path.join(__dirname, 'views'))
	.set('view engine', 'ejs');



module.exports = app;