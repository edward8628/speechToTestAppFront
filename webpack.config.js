var path = require('path');
var webpack = require('webpack');
     
module.exports = {
  devtool: 'eval-source-map',
  context: path.join(__dirname, 'src'),
  
  entry: [
    './js/app'
  ],
  
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
      {test: /\.jsx?$/, exclude: /node_modules/, loaders: ['react-hot', 'babel'] },
      {test: /\.json?$/, loader: 'json'},
      {test: /\.scss$/, loader: 'style!css!sass?modules&localIdentName=[name]---[local]---[hash:base64:5]'},
      {test: /.(png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/, loader: 'url-loader?limit=100000' }
    ]
  }
};
