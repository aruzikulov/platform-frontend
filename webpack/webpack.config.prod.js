const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const merge = require("webpack-merge");
const path = require("path");

const configCommon = require("./webpack.config.common");
const paths = require("./paths");

module.exports = merge(configCommon, {
  mode: "production",
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        uglifyOptions: {
          ecma: 6,
        },
      }),
      new OptimizeCSSAssetsPlugin(),
    ],
  },
  output: {
    filename: "[hash].[name].min.js",
  },
  plugins: [
    new CleanWebpackPlugin(paths.dist, {
      root: paths.root,
    }),
    new MiniCssExtractPlugin({
      filename: "[contenthash].[name].css",
    }),
  ],
  module: {
    rules: [
      {
        // there is a lof of duplication with dev config but merge.smart fails
        // when using oneOf so for now we can leave it like this
        oneOf: [
          {
            test: /\.module.scss$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1,
                  modules: true,
                  localIdentName: "[name]__[local]___[hash:base64:5]",
                  camelCase: "dashesOnly",
                  minimize: true,
                },
              },
              {
                loader: "postcss-loader",
                options: {
                  config: {
                    path: path.join(__dirname, "postcss.config.js"),
                  },
                },
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
              MiniCssExtractPlugin.loader,
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1,
                  modules: false,
                  localIdentName: "[name]__[local]___[hash:base64:5]",
                  camelCase: "dashesOnly",
                  minimize: true,
                },
              },
              {
                loader: "sass-loader",
              },
            ],
          },
          {
            test: /\.css$/,
            use: [
              MiniCssExtractPlugin.loader,
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
                  configFile: "tsconfig.json",
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
