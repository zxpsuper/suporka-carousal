// webpack.prod.js
// 存放 prod 配置
const path = require('path');
// 合并配置文件
const merge = require('webpack-merge');
const common = require('./webpack.base.js');
const data = require('./setting.js');
module.exports = merge(common, {
    entry: data.prodEntry, //入口
    module: {},
    plugins: [],
    mode: 'production',
    output: {
        path: path.resolve(__dirname, '../'),
        library: data.library,
        libraryExport: 'default',
        libraryTarget: 'umd',
        filename: data.filename,
    },
});
