import Express from 'express';
import Cors from 'cors';
import Helmet from 'helmet';
import BodyParser from 'body-parser';
import FileUpload from 'express-fileupload';
import Path from 'path';
import ErrorHandler from './middlewares/error-handler';
import Routers from './routes/index';
import I18N from 'i18n';

const app = Express();

I18N.configure({
	locales: ['en'],
	directory: __dirname + '/locales',
	defaultLocale: 'en',
	autoReload: true,
	updateFiles: false
});

app
	.use(Helmet())
	.use(Helmet.referrerPolicy({policy: 'same-origin'}))
	.use(FileUpload({
		limits: {fileSize: 5 * 1024 * 1024}
	}))
	.use(Cors())
	.use(BodyParser.json())
	.use(BodyParser.urlencoded({extended: true}))
	.use('/api', Routers)
	.use(ErrorHandler)
	.use(Express.static(Path.join(__dirname, '..', 'public', 'views')))
	.set('views', Path.join(__dirname, '..', 'public', 'views'))
	.set('view engine', 'ejs');

module.exports = app;