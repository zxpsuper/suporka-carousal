import { extend } from '../utils/tool.js';

class ScrapAward {
    constructor(userOption) {
        this.option = {
            canvasId: 'canvas',
            backgroundImageUrl:
                'https://zxpsuper.github.io/Demo/guajiang/p_1.jpg',
            width: 320,
            height: 160,
            backgroundSize: '100% 100%',
        };
        this.ctx = null;
        this.init(userOption);
    }
    init(userOption) {
        if (this.canvas) {
            this.canvas.removeEventListener(tapstart, eventDown.bind(this));
            this.canvas.removeEventListener(tapend, eventUp.bind(this));
            this.canvas.removeEventListener(tapmove, eventMove.bind(this));
        }
        // 合并用户配置
        if (Object.assign) {
            Object.assign(this.option, userOption);
        } else {
            extend(this.option, userOption, true);
        }

        let that = this,
            img = (this.img = new Image()),
            canvas = (this.canvas = document.querySelector(
                `#${this.option.canvasId}`
            )),
            hastouch = 'ontouchstart' in window ? true : false,
            tapstart = hastouch ? 'touchstart' : 'mousedown',
            tapmove = hastouch ? 'touchmove' : 'mousemove',
            tapend = hastouch ? 'touchend' : 'mouseup',
            mousedown = false;
        img.src = this.option.backgroundImageUrl;
        var w = (img.width = this.option.width),
            h = (img.height = this.option.height);
        this.canvasOffsetX = canvas.offsetLeft;
        this.canvasOffsetY = canvas.offsetTop;
        canvas.width = w;
        canvas.height = h;
        canvas.style.background = 'url(' + img.src + ') no-repeat';
        canvas.style.backgroundSize = this.option.backgroundSize || 'contain';
        this.ctx = canvas.getContext('2d');
        let ctx = this.ctx;
        this.img.addEventListener('load', backgroundImageLoaded.bind(this));
        // 图片加载完成后
        function backgroundImageLoaded(e) {
            ctx.fillStyle = 'gray';
            ctx.fillRect(0, 0, w, h);
            ctx.globalCompositeOperation = 'destination-out';
            canvas.addEventListener(tapstart, eventDown.bind(this));
            canvas.addEventListener(tapend, eventUp.bind(this));
            canvas.addEventListener(tapmove, eventMove.bind(this));
        }
        // 点击开始事件
        function eventDown(e) {
            e.preventDefault();
            this.mousedown = true;
        }
        // 点击结束事件
        function eventUp(e) {
            e.preventDefault();
            this.mousedown = false;
        }
        // 刮奖事件
        function eventMove(e) {
            let ctx = this.ctx;
            e.preventDefault();
            if (this.mousedown) {
                if (e.changedTouches) {
                    e = e.changedTouches[0];
                }
                var x =
                        (e.clientX + document.body.scrollLeft || e.pageX) -
                            this.canvasOffsetX || 0,
                    y =
                        (e.clientY + document.body.scrollTop || e.pageY) -
                            this.canvasOffsetY || 0;

                ctx.beginPath();
                ctx.arc(x, y, 10, 0, Math.PI * 2);
                ctx.fill();
            }
            handleFilledPercentage(getFilledPercentage());
        }
        // 计算已经刮过的区域占整个区域的百分比
        function getFilledPercentage() {
            let imgData = that.ctx.getImageData(0, 0, w, h);
            // imgData.data是个数组，存储着指定区域每个像素点的信息，数组中4个元素表示一个像素点的rgba值
            let pixels = imgData.data;
            let transPixels = [];
            for (let i = 0; i < pixels.length; i += 4) {
                // 严格上来说，判断像素点是否透明需要判断该像素点的a值是否等于0，
                // 为了提高计算效率，这儿设置当a值小于128，也就是半透明状态时就可以了
                if (pixels[i + 3] < 128) {
                    transPixels.push(pixels[i + 3]);
                }
            }
            return (
                ((transPixels.length / (pixels.length / 4)) * 100).toFixed(2) +
                '%'
            );
        }
        // 设置阈值，去除灰色涂层
        function handleFilledPercentage(percentage) {
            percentage = percentage || 0;
            if (parseInt(percentage) > 50) {
                // 当像素点的个数超过  50% 时，清空画布，显示底图
                ctx.clearRect(0, 0, w, h);
            }
        }
    }
}
export default ScrapAward;
