var path = require('path');
var webpack = require('webpack');
     
module.exports = {
  devtool: 'eval-source-map',
  stats: {
    colors: true
  },
  
  entry: './src/js/app.js',
  
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  
  module: {
    loaders: [
      {test: /\.js?$/, exclude: /node_modules/, loader: 'babel'}, 
      {test: /\.json?$/, loader: 'json'},
      {test: /\.scss$/, loader: 'style!css!sass?modules&localIdentName=[name]---[local]---[hash:base64:5]'},
      {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      {test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  }
};
