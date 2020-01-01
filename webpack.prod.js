const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [new CleanWebpackPlugin(), new CompressionPlugin()],
});
