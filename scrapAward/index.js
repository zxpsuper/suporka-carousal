import ScrapAward from './scrapAward-dev.js';
let scraAward = new ScrapAward();
document.getElementById('try_again').addEventListener('click', function(e) {
    var imgs = [
        'https://zxpsuper.github.io/Demo/guajiang/p_1.jpg',
        'https://zxpsuper.github.io/Demo/guajiang/p_0.jpg',
    ];
    var num = Math.floor(Math.random() * 2);
    scraAward.init({
        backgroundImageUrl: imgs[num],
    });
});
