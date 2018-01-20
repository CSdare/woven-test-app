const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'app.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "bundle.js",
  },
  resolveLoader: {
    modules: [ 'node_modules', path.resolve(__dirname, '../woven-loader') ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [ path.resolve(__dirname, 'woven_functions') ],
        loader: [ 'babel-loader' ],
      },
      {
        test: /\.js$/,
        include: [ path.resolve(__dirname, 'woven_functions') ],
        loader: [ 'babel-loader', 'woven-loader' ],
      },
    ],
  },
}