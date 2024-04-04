const path = require('path');
const Dotenv = require('dotenv-webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
  const BASE_PATH = `${env.production ? '/faq/' : '/'}` 
  return {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: BASE_PATH
    },
    resolve: {
      extensions: ['.js'],
      modules: [path.join(__dirname, 'src'), 'node_modules'],
      alias: {
        react: path.join(__dirname, 'node_modules', 'react'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)?$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: [
            { loader: 'style-loader', },
            { loader: 'css-loader', },
            { loader: 'postcss-loader', },
          ],
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
          type: 'asset',
        },
      ],
    },
    plugins: [
      new HtmlWebPackPlugin({ 
        publicPath: BASE_PATH,
        template: './public/index.html',
      }),
      new Dotenv({ 
        path: `.env.${env.production ? 'production' : 'development'}` 
      }),
    ],
    devServer: {
      allowedHosts: ['localhost'],
      historyApiFallback: true,
    },
  };
};
