const webpack = require('webpack');
const path = require('path');
const WebpackNotifierPlugin = require('webpack-notifier');
const BabiliPlugin = require('babili-webpack-plugin');
const entries = require('./webpack.entries.json');
const WebpackShellPlugin = require('./WebpackShellPlugin.js');

module.exports = {
  context: path.resolve(__dirname, './'),
  entry: entries,
  output: {
    path: path.join(__dirname, "/assets/js"),
    filename:"[name].bundle.js",
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js','.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              "presets":["es2015", "react"],
              "plugins": [
                ["transform-decorators-legacy"],
                ["transform-runtime"],
                ["transform-object-rest-spread", { "useBuiltIns": true }]
              ]
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader:"style-loader"
          },{
            loader:"css-loader",
          },{
            loader:"sass-loader",
            options: {
               includePaths: [
                path.resolve(__dirname, "./node_modules/foundation-sites/scss"),
                path.resolve(__dirname, "./node_modules/motion-ui")
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: (function() {
    let ENV = process.env.NODE_ENV;
    let plugins =  [
      new WebpackNotifierPlugin({alwaysNotify: true}),
      new WebpackShellPlugin({
        onBuildStart: ['pidof nw | xargs kill'],
        onBuildEnd: ['npm run start']
      }),
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(ENV || "development")
        }
      })
    ]
    if(ENV === "production") plugins.push(new BabiliPlugin());
    return plugins;
  })()
}
