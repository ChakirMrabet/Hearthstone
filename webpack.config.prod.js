const path = require("path");
const DotEnv = require("dotenv-webpack");
const CleanPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    bundle: "./src/index.tsx",
    vendor: ["react", "react-dom"],
  },
  output: {
    path: path.join(__dirname, "dist"),
  },
  module: {
    rules: [
      { test: /\.ts(x?)$/, use: "ts-loader", exclude: /node_modules/ },
      {
        test: /\.(s*)css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      { test: /\.(png|jpg)$/, use: "file-loader" },
      { test: /\.(wav|mp3)$/, use: "file-loader" },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      assets: path.join(__dirname, "assets"),
    },
  },
  plugins: [
    new DotEnv(),
    new CleanPlugin.CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "styles.[hash].css",
    }),
    new HtmlPlugin({
      template: "./public/index.html",
    }),
  ],
};
