const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookie = require('cookie-parser');
const session = require('express-session');
const routes = require('./Routes');

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static(__dirname+'/Public'));
	
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.urlencoded({extended:true}));

app.use(cookie(process.env.SECRETKEY));

app.use(session({
    secret:process.env.SECRETKEY,
    resave:false,
    saveUninitialized:false,

}));

app.use('/api', routes);

module.exports = app;