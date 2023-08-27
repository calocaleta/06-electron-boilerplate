const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@utils': path.resolve(__dirname, './electron/utils/'),
      '@electron': path.resolve(__dirname, './electron/'),
      '@public': path.resolve(__dirname, './public/'),
    },
  },
  target: 'electron-renderer',
};