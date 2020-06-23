const path = require("path");
const DotEnv = require("dotenv-webpack");

module.exports = {
  mode: "development",
  entry: {
    app: "./src/index.tsx",
    vendor: ["react", "react-dom"],
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      assets: path.join(__dirname, "assets"),
    },
  },
  module: {
    rules: [
      { test: /\.ts(x?)$/, use: "ts-loader", exclude: /node_modules/ },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
      },
      {
        test: /\.(s*)css$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      { test: /\.(png|jpg)$/, use: "file-loader" },
      { test: /\.(wav|mp3)$/, use: "file-loader" },
    ],
  },
  devtool: "inline-source-map",
  devServer: {
    port: 3000,
    contentBase: path.join(__dirname, "public"),
    watchContentBase: true,
  },
  plugins: [new DotEnv()],
};
