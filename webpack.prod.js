// webpack.prod.js
// 存放 prod 配置
const path = require('path');
// 合并配置文件
const merge = require('webpack-merge');
const common = require('./webpack.base.js');

module.exports = merge(common, {
  // entry: './carousal-test.js', //入口
  entry: './colorGame-dev.js', //入口
  module: {},
  plugins: [],
  mode: 'production',
  output: {
    path: path.resolve(__dirname, './'),
    library: 'ColorGame',
    libraryExport: "default",
    libraryTarget: 'umd',
    filename: 'colorGame.js',
    // filename: 'carousal.js',
  },
});