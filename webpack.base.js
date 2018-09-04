// webpack.base.js
// 存放 dev 和 prod 通用配置

module.exports = {
  entry: {
    index: './index.js', //入口
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
};