'use strict'
require('dotenv').config();

import bodyParser               from 'body-parser';
import express                  from 'express';
import path                     from 'path';
import { match, RouterContext } from 'react-router';
import React                    from 'react';
import { renderToString }       from 'react-dom/server';

const debug = require('debug')(`${process.env.APPNAME}:index`);
const app = express();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

app.set('view engine', 'html');
app.set('views', __dirname);

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/health", (req, res) => {
  debug("healthcheck");
  res.status(200).send({success: "frontend template is up"});
});

if (app.get('env') == 'development') {
  // comment out to stop unexpected click events!!
  // const browserSync              = require('browser-sync');
  // const historyApiFallback       = require('connect-history-api-fallback');
  const webpack                  = require('webpack');
  const webpackDevMiddleware     = require('webpack-dev-middleware');
  const webpackHotMiddleware     = require('webpack-hot-middleware');
  const webpackConfig = require('../webpack.config');
  const bundler = webpack(webpackConfig);

  const middleware = webpackDevMiddleware(bundler, {
    // IMPORTANT: dev middleware can't access config, so we should
    // provide publicPath by ourselves
    publicPath: webpackConfig.output.publicPath,
    // pretty colored output
    stats: { colors: true }

    // for other settings see
    // http://webpack.github.io/docs/webpack-dev-middleware.html
  });
  
  app.use(middleware);
  app.use(webpackHotMiddleware(bundler));
  // app.use(historyApiFallback());
} else {
  app.use("/", express.static(path.join(__dirname, '../build')));
}

app.get( '*', (req, res) => {
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
      res.status(200).send(renderToString(<RouterContext {...renderProps} />))
    } else {
      res.status(404).send('Not found')
    }
  })
})

if(process.env.DEBUG != 'randomfrontend*') console.log(`'export DEBUG=randomfrontend*' for debugging`);
app.listen(port, host, () => {
  debug(`randomfrontend is running on ${host}:${port}`);
});

