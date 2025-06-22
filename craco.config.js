const webpack = require("webpack");
const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // 1. Add Fallbacks for Node.js Core Modules
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback, // Preserve any existing fallbacks
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        util: require.resolve("util/"),
        zlib: require.resolve("browserify-zlib"),
        stream: require.resolve("stream-browserify"),
        crypto: require.resolve("crypto-browserify"),
        assert: require.resolve("assert/"),
        url: require.resolve("url/"),
      };

      // 2. Provide global Node.js variables (process, Buffer) for browser environment
      // This is crucial for libraries like Axios that expect 'process' to be available.
      webpackConfig.plugins = [
        ...(webpackConfig.plugins || []), // Keep existing plugins
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"], // Polyfill Buffer
          process: "process/browser", // Polyfill process
        }),
      ];

      // 3. Resolve issues with '.mjs' and 'process/browser' in Webpack 5
      // This part specifically targets the "BREAKING CHANGE" error for fully specified requests.
      // It ensures that Node.js module polyfills are correctly resolved for different module types.
      webpackConfig.module.rules.push({
        test: /\.m?js/,
        resolve: {
          fullySpecified: false, // Disable fully specified imports for .mjs files
        },
      });

      // 4. Optionally, add specific aliases if 'process/browser' still doesn't resolve
      // This is a more direct way to tell Webpack where to find 'process/browser'.
      // Generally, the ProvidePlugin and fullySpecified: false should handle it,
      // but this can be a backup. Uncomment if errors persist.
      // webpackConfig.resolve.alias = {
      //   ...webpackConfig.resolve.alias,
      //   'process': 'process/browser.js',
      // };

      return webpackConfig;
    },
  },
};
