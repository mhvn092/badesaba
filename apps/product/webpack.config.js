const { composePlugins, withNx } = require('@nx/webpack');
const webpack = require('webpack');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), (config) => {
  const environmentPlugin = new webpack.DefinePlugin({
    'process.env': JSON.stringify(process.env),
  });
  
  if (!config.plugins?.length) config.plugins = [];

  config.plugins.push(environmentPlugin);
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`
  return config;
});
