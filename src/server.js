'use strict'
require('dotenv').config();

import bodyParser               from 'body-parser';
import express                  from 'express';
import path                     from 'path';
import { match, RouterContext } from 'react-router';
import React                    from 'react';
import { renderToString }       from 'react-dom/server';
import webpackConfig            from '../webpack.config.js';
var watson = require('watson-developer-cloud');

import routes                   from './routes/routes.js';

const debug = require('debug')(`${process.env.APPNAME}:index`);
const app = express();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 5000;

const ignore = (req, res, next) => {
  if (req.url.match(/^\/(assets|browser-sync)\/.+$/) || req.url === '/favicon.ico') { //ignore static files
    res.end();
  } else {
    next();
  }
}

app.set('view engine', 'ejs');
app.set('views', __dirname);

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/health", (req, res) => {
  debug("healthcheck");
  res.status(200).send({success: "frontend template is up"});
});

debug('NODE_ENV', app.get('env'));
if (app.get('env') == 'development') {
  const webpack                  = require('webpack');
  const webpackDevMiddleware     = require('webpack-dev-middleware');
  const webpackHotMiddleware     = require('webpack-hot-middleware');
  const bundler = webpack(webpackConfig);
  const middleware = webpackDevMiddleware(bundler, {
    // IMPORTANT: dev middleware can't access config, so we should
    publicPath: webpackConfig.output.publicPath,
    stats: { colors: true },
    noInfo: true,
    // for other settings see
    // http://webpack.github.io/docs/webpack-dev-middleware.html
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(bundler));
} else {
  app.use("/", express.static(path.join(__dirname, '../build')));
}

var authorization = watson.authorization({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  version: 'v1',
  url: 'https://stream.watsonplatform.net/authorization/api'
});

app.get('/getToken', function(req, res) {
  var params = {
    url: 'https://stream.watsonplatform.net/speech-to-text/api'
  };
  
  authorization.getToken(params, function (err, token) {
    if (!token) {
      res.send({'error':err});
    } else {
      res.send(token);
    }
  });
});


app.get( '*', ignore, (req, res) => {
  // Note that req.url here should be the full URL path from
  // the original request, including the query string.
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      // You can also check renderProps.components or renderProps.routes for
      // your "not found" component or route respectively, and send a 404 as
      // below, if you're using a catch-all route.
      res.status(200).render('index', {
        root: renderToString(<RouterContext {...renderProps} />)
      })
    } else {
      res.status(404).send('Not found')
    }
  })
})

if(process.env.DEBUG != 'randomfrontend*') console.log(`'export DEBUG=randomfrontend*' for debugging`);
app.listen(port, host, () => {
  debug(`randomfrontend is running on ${host}:${port}`);
});

