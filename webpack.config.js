const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
  entry: {
    background: './src/background.tsx',
    inject: './src/inject.tsx',
    popover: './src/popover.tsx',
    iframe: './src/iframe.tsx',
    embed: './src/embed.tsx',
    code: './src/code.tsx',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build')
  },
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
      }
    ]
  },
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: './src/popover.html',
      to: 'popover.html'
    }]),
    new CopyWebpackPlugin([{
      from: './src/iframe.html',
      to: 'iframe.html'
    }]),
    new CopyWebpackPlugin([{
      from: './src/manifest.json',
      to: 'manifest.json'
    }]),
    new CopyWebpackPlugin([{
      from: './src/img',
      to: 'img'
    }]),
    new CopyWebpackPlugin([{
      from: './src/normalize.css',
      to: 'normalize.css'
    }]),
    new CopyWebpackPlugin([{
      from: './src/fonts',
      to: 'fonts'
    }]),
    new CopyWebpackPlugin([{
      from: './src/code.html',
      to: 'code.html'
    }])
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
