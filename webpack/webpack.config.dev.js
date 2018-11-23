const merge = require("webpack-merge");
const webpack = require("webpack");
const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const generateProxyConfig = require("./proxy-urls");
const configCommon = require("./webpack.config.common");
const paths = require("./paths");

module.exports = merge(configCommon, {
  mode: "development",
  devServer: {
    contentBase: paths.dist,
    host: "localhost",
    port: 9090,
    https: true,
    hot: true,
    overlay: true,
    historyApiFallback: true,
    headers: {
      "Content-Security-Policy":
        "default-src 'self'; script-src 'self' 'unsafe-eval' www.google-analytics.com/analytics.js " +
        "'unsafe-inline' *; frame-src *; " + // this should be only enabled for twitter-iframe.html
        "style-src blob: fonts.googleapis.com 'self' 'unsafe-inline' " +
        "*; " + // this should be only enabled for twitter-iframe.html
        "font-src 'self' fonts.gstatic.com; " +
        "img-src 'self' data: documents.neufund.io documents.neufund.net www.google-analytics.com stats.g.doubleclick.net " +
        "*; " + // this should be only enabled for twitter-iframe.html
        "connect-src 'self' https://*.neufund.io wss://localhost:9090", // needed for hot reload
    },
    proxy: generateProxyConfig("http://localhost", "http://localhost:8545"),
  },
  entry: ["react-hot-loader/patch"],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ForkTsCheckerWebpackPlugin({ tsconfig: "tsconfig.dev.json" }),
  ],
  module: {
    rules: [
      {
        // there is a lof of duplication with prod config but merge.smart fails
        // when using oneOf so for now we can leave it like this
        oneOf: [
          {
            test: /\.module.scss$/,
            use: [
              {
                loader: "style-loader",
              },
              {
                loader: "css-loader",
                options: {
                  sourceMap: true,
                  importLoaders: 1,
                  modules: true,
                  localIdentName: "[name]__[local]___[hash:base64:5]",
                  camelCase: "dashesOnly",
                },
              },
              {
                loader: "postcss-loader",
                options: { config: { path: path.join(__dirname, "postcss.config.js") } },
              },
              {
                loader: "sass-loader",
              },
              {
                loader: "sass-resources-loader",
                options: {
                  resources: [path.join(__dirname, "../app/styles/neufund-theme.scss")],
                },
              },
            ],
          },
          {
            test: /\.scss$/,
            use: [
              {
                loader: "style-loader",
              },
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1,
                  modules: false,
                  localIdentName: "[name]__[local]___[hash:base64:5]",
                  camelCase: "dashesOnly",
                },
              },
              { loader: "sass-loader" },
            ],
          },
          {
            test: /\.css$/,
            use: [
              {
                loader: "style-loader",
              },
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1,
                  modules: false,
                  localIdentName: "[name]__[local]___[hash:base64:5]",
                  camelCase: "dashesOnly",
                },
              },
            ],
          },
          {
            test: /\.(tsx?)$/,
            use: [
              {
                loader: "ts-loader",
                options: {
                  configFile: "tsconfig.dev.json",
                  transpileOnly: true,
                  experimentalWatchApi: true,
                },
              },
            ],
            include: paths.app,
          },
          {
            test: /\.(jpg|png|svg|gif)$/,
            loader: "url-loader",
            exclude: paths.inlineIcons,
            options: {
              limit: 25000,
              publicPath: "/",
            },
          },
          {
            test: /\.(svg)$/,
            loader: "raw-loader",
            include: paths.inlineIcons,
          },
          {
            test: /\.(woff2|woff|ttf|eot|otf)$/,
            loader: "file-loader",
            options: {
              name: "fonts/[hash].[ext]",
            },
          },
        ],
      },
    ],
  },
});
