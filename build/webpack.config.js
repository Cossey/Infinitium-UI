const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const path = require('path');

function resolvePath(dir) {
  return path.join(__dirname, '..', dir);
}

const env = process.env.NODE_ENV || 'development';
const target = process.env.TARGET || 'web';

const apiBaseUrl = process.env.TDNS_APIBASE || 'http://localhost:8080'

module.exports = {
  mode: env,
  target: env === "development" ? "web" : "browserslist",
  entry: {
    app: './src/js/app.js',
  },
  output: {
    path: resolvePath('www'),
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].js',
    publicPath: '',
    hotUpdateChunkFilename: 'hot/hot-update.js',
    hotUpdateMainFilename: 'hot/hot-update.json',
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolvePath('src'),
    },

  },
  devtool: env === 'production' ? 'source-map' : 'eval',
  devServer: {
    hot: true,
    open: true,
    compress: true,
    contentBase: '/www/',
    disableHostCheck: true,
    historyApiFallback: true,
    proxy: [{
      context: ['/api'],
      target: apiBaseUrl,
      changeOrigin: true,
    }]
  },
  optimization: {
    concatenateModules: true,
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.(mjs|js|jsx)$/,
        include: [
          resolvePath('src'),

        ],
        use: [
          {
            loader: require.resolve('babel-loader'),

          },
        ]
      },


      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: [
          (env === 'development' ? 'style-loader' : {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          }),
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.styl(us)?$/,
        use: [
          (env === 'development' ? 'style-loader' : {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          }),
          'css-loader',
          'postcss-loader',
          'stylus-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          (env === 'development' ? 'style-loader' : {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          }),
          'css-loader',
          'postcss-loader',
          'less-loader',
        ],
      },
      {
        test: /\.(sa|sc)ss$/,
        use: [
          (env === 'development' ? 'style-loader' : {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          }),
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'images/[name].[ext]',

        },
        type: 'javascript/auto'
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac|m4a)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[ext]',

        },
        type: 'javascript/auto'
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[ext]',

        },
        type: 'javascript/auto'
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
      'process.env.TARGET': JSON.stringify(target),
      'process.env.I18N_LOCALE': JSON.stringify(process.env.I18N_LOCALE),
    }),
    new VueLoaderPlugin(),
    ...(env === 'production' ? [
      new CssMinimizerPlugin(),
    ] : [
      // Development only plugins
      new webpack.HotModuleReplacementPlugin(),

    ]),
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './src/index.html',
      inject: true,
      minify: env === 'production' ? {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      } : false,
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          noErrorOnMissing: true,
          from: resolvePath('src/static'),
          to: resolvePath('www/static'),
        },
        {
          noErrorOnMissing: true,
          from: resolvePath('src/manifest.json'),
          to: resolvePath('www/manifest.json'),
        },
      ],
    }),

    new WorkboxPlugin.InjectManifest({
      swSrc: resolvePath('src/service-worker.js'),
    }),
  ],
};