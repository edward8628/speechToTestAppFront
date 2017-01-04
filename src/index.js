'use strict'
require('dotenv').config();

import bodyParser               from 'body-parser';
import express                  from 'express';
import path                     from 'path';
import webpackConfig            from '../webpack.config.js';

const debug = require('debug')(`${process.env.APPNAME}:index`);
const app = express();

app.use(bodyParser.json());
app.set('view engine', 'html');
app.set('views', __dirname);

app.get("/v1/health", (req, res) => {
  debug("healthcheck");
  res.status(200).send({success: "frontend is up"});
});

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

if(process.env.DEBUG != 'randomfrontend*') console.log(`'export DEBUG=randomfrontend*' for debugging`);
app.listen(port, host, () => {
  debug(`randomfrontend is running on ${host}:${port}`);
});

