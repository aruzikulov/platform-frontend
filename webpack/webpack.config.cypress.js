const webpack = require("webpack");

const paths = require("./paths");
const loadAppEnv = require("./loadAppEnv");

const applicationEnv = loadAppEnv(process.env);

module.exports = {
  mode: "none",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(tsx?)$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.cypress.json",
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": applicationEnv,
    }),
  ],
};
