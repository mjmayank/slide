const path = require('path')
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const config = {
  entry: {
    index: './src/index.tsx',
    background: './src/background.tsx'
  },
  output: {
    filename: '[name].js',
    publicPath: '',
    path: path.resolve(__dirname, 'build')
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        use: 'babel-loader',
        test: /\.jsx?$/
      },
      {
        use: 'css-loader',
        test: /\.css$/i
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './src/manifest.json', to: 'manifest.json' },
        // { from: './src/img', to: 'img' },
        // { from: './src/fonts', to: 'fonts' },
        { from: './src/normalize.css', to: 'normalize.css' }
      ]
    }),
    new CopyPlugin({
      patterns: [
          { from: 'src/img', to: 'img' }
      ]
    }),
    // https://stackoverflow.com/questions/64475910/replacing-polyfill-for-process-in-webpack-v5-from-v4
    new webpack.DefinePlugin({
      'process.env.NODE_DEBUG': JSON.stringify(process.env.NODE_DEBUG),
      'process.type': JSON.stringify(process.type),
      'process.version': JSON.stringify(process.version),
      'process.env.npm_package_version': JSON.stringify(process.version),
      'process': {
        env: {}
      }
    })
  ],
  resolve: {
    alias: {
      'thrift': path.resolve('./node_modules/thrift/lib/nodejs/lib/thrift/browser'),
      'int64Util': path.resolve('./node_modules/thrift/lib/nodejs/lib/thrift/int64_util'),
    },
    extensions: [".tsx", ".ts", ".js", ".jsx"],
    modules: [
      path.resolve('./src'),
      'node_modules',
    ]
  }
};

module.exports = config;
