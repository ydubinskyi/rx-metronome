const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CompressionPlugin = require('compression-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new CompressionPlugin(),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      navigateFallback: '/index.html',
      navigateFallbackWhitelist: [/^(?!\/__)/],
    }),
    new WebpackPwaManifest({
      name: 'rx-metronome',
      short_name: 'Metronome',
      theme_color: '#302ae6',
      background_color: '#302ae6',
      display: 'standalone',
      Scope: '/',
      start_url: '/',
      icons: [
        {
          src: path.resolve('src/assets/images/icon.png'),
          sizes: [96, 128, 192, 256, 384, 512],
        },
      ],
    }),
  ],
});
