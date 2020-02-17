
let name = 'htmlRouter';
module.exports = {
    /* // carousal
    devEntry: './carousal/index.js',
    prodEntry: './carousal/carousal-dev.js',
    library: 'Carousal',
    filename: 'carousal.js',
    pluginHtml: '../carousal/index.html', */

    /* // luckDraw
    devEntry: './luckyDraw/index.js',
    prodEntry: './luckyDraw/luckDraw-dev.js',
    library: 'LuckyDraw',
    filename: 'luckyDraw.js',
    pluginHtml: '../luckyDraw/index.html', */

    // luckDraw
    devEntry: `./${name}/index.js`,
    prodEntry: `./${name}/${name}-dev.js`,
    library: `${name}`,
    filename: `${name}.js`,
    pluginHtml: `../${name}/index.html`,
};
