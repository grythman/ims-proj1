const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // ModuleScopePlugin-ийг бүр хасах (радикал арга)
      webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
        plugin => !plugin.constructor || plugin.constructor.name !== 'ModuleScopePlugin'
      );

      // react-refresh-webpack-plugin нэмэх
      if (isDevelopment) {
        webpackConfig.plugins.push(
          new ReactRefreshWebpackPlugin({
            overlay: false,
          })
        );
      }

      // Babel loader тохиргоог өөрчлөх
      const babelLoader = webpackConfig.module.rules
        .find(rule => Array.isArray(rule.oneOf))
        .oneOf.find(rule => rule.loader && rule.loader.includes('babel-loader'));
      
      if (babelLoader && isDevelopment) {
        babelLoader.options.plugins = babelLoader.options.plugins || [];
        // Хэрэв шаардлагатай бол Fast Refresh плагиныг нэмэх
        babelLoader.options.plugins.push(
          require.resolve('react-refresh/babel')
        );
      }
      
      return webpackConfig;
    },
  }
}; 