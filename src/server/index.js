import 'babel-polyfill';
import express from 'express';
import proxy from 'express-http-proxy';
import bodyParser from 'body-parser';

// // FILE UPLOAD
// import upload from './upload';
// // Mailer
// import nodemailer from 'nodemailer';
// import hbs from 'nodemailer-express-handlebars';
// import webConfig from './../../webConfig';

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static('build'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();
app.use(router);

const bootstrap = require('./views/bootstrap');
bootstrap(app, router);

// app.post('/uploadfile', upload)

app.listen(port, () => {
    console.log(`Running on Port ${port}`);
});
