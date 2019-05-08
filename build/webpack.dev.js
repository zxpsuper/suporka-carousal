// webpack.dev.js
// 存放 dev 配置
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.base.js');
const path = require('path');
const data = require('./setting.js');
module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        // 开发服务器
        contentBase: '../dist',
    },
    output: {
        // 输出
        filename: 'js/[name].[hash].js', // 每次保存 hash 都变化
        path: path.resolve(__dirname, '../dist'),
    },
    module: {},
    plugins: [
        // 解决vender后面的hash每次都改变
        new webpack.HashedModuleIdsPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, data.pluginHtml),
        }),
    ],
    mode: 'development',
});
