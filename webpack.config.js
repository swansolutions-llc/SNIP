// webpack.config.js
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  // other configurations
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  }
};
