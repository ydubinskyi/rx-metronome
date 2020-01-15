const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkerPlugin = require('worker-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Critters = require('critters-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new WorkerPlugin({
      globalObject: false,
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new Critters(),
    new CopyPlugin([
      {from: './src/favicon.ico', to: './'},
      {from: './src/manifest.json', to: './'},
      {from: './src/assets/**/*', to: 'icons/[name].[ext]'},
    ]),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
