const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const basePath = __dirname;

module.exports = {
  context: path.join(basePath, "src"),
 
  resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx']
  },

  entry: {
    app: ['./app.tsx',],
    vendor: ['material-ui'],
  },

  module: {
    rules: [
      // *** Loading pipe for Typescript ***
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'awesome-typescript-loader',
        options: {
          useBabel: true,
        },
      },
       // *** Loading pipe for Raster Images ***
       {
        test: /\.(png|jpg|gif|bmp)?$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 16000,
              name: "assets/img/[name].[ext]",
            },
          },
        ],
      },
      // *** Loading pipe for Vector Images (exclude svg from fonts) ***
      {
        test: /\.svg$/,
        exclude: [/node_modules/, /fonts/],
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1000,
              name: "assets/svg/[name].[ext]",
            },
          },
        ],
      },
      // *** Loading pipe for Fonts. Primary EOT (welcome to be embedded).
      // The rest are fallbacks just in case, dont' embedd them ***
      {
        test: /\.eot$/,
        // exclude: [/node_modules/],
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 5000,
              mimetype: "application/vnd.ms-fontobject",
              name: "assets/fonts/[name].[ext]",
            },
          },
        ],
      },
      {
        test: /\.([ot]tf)$/,
        // exclude: [/node_modules/],
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1000,
              mimetype: "application/octet-stream",
              name: "assets/fonts/[name].[ext]",
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2)?$/,
        // exclude: [/node_modules/],
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1000,
              mimetype: "mimetype=application/font-woff",
              name: "assets/fonts/[name].[ext]",
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        // exclude: [/node_modules/],
        include: [/fonts/],
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1000,
              mimetype: "image/svg+xml",
              name: "assets/fonts/[name].[ext]",
            },
          },
        ],
      },      
    ]
  },
  plugins: [
    // *** Generate index.html in /dist ***
    new HtmlWebpackPlugin({
      filename: 'index.html', // Name of file in ./dist/
      template: 'index.html', // Name of template in ./src
      hash: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['app', 'vendor'],
    }),
  ]
}
