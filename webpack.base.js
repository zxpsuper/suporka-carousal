// webpack.base.js
// 存放 dev 和 prod 通用配置
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = {
  entry: {
    index: './index.js', //入口
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
  ]
};