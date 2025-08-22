const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    main: path.join(__dirname, 'src/main.js'),
    //animations: path.join(__dirname, 'src/script/animations/index.js'),
    components: path.join(__dirname, 'src/script/components/index.js'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[contenthash].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
      filename: 'index.html',
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'src/public'),
          to: path.join(__dirname, 'dist'),
        },
      ],
    }),
  ],
};
