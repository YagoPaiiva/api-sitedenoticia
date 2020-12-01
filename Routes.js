const express = require('express');
const Router = express.Router();
const NotePostController = require('./src/Controllers/NotePostController');
const NoteGetController = require('./src/Controllers/noteGetController');


const ImageMiddle = require('./MiddleWare/imageMiddleware');

Router.get('/ping', NoteGetController.showPing);
Router.get('/getCategories', NoteGetController.showcategories);
Router.get('/getAccounts',NoteGetController.showaccounts )
Router.get('/getNews', NoteGetController.showNews);

Router.post('/email', NotePostController.run);
Router.post('/signin', NotePostController.login);
Router.post('/createAccount', NotePostController.createAccount);


Router.post('/createCatergory', NotePostController.createCategories);

Router.post('/createNews',ImageMiddle.upload, ImageMiddle.resize, NotePostController.createNews);

module.exports = Router;