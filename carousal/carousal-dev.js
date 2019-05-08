import './index.scss';
class Carousal {
    constructor(userOption) {
        this.option = {
            time: 4000,
            transition: 0.8,
            autoScroll: true,
            showDot: false,
        };
        // 当前索引
        this.number = 1;
        // 定时器
        this.timer = null;
        this.interval = null;
        this.carousal = document.getElementById('carousal');
        this.wrapper = document.querySelector('#wrapper');
        this.childrenLength = document.getElementById(
            'wrapper'
        ).children.length;
        this.init(userOption);
    }
    init(userOption) {
        // 合并用户配置
        if (Object.assign) {
            Object.assign(this.option, userOption);
        } else {
            this.extend(this.option, userOption, true);
        }
        this.wrapper.style.transition = `all ${this.option.transition}s`;
        this.wrapper.style['-moz-transition'] = `all ${
            this.option.transition
        }s`;
        this.wrapper.style['-webkit-transition'] = `all ${
            this.option.transition
        }s`;
        this.wrapper.style['-o-transition'] = `all ${this.option.transition}s`;
        // 首尾添加元素
        this.pushItem();

        if (this.option.showDot) {
            let node = document.createElement('div');
            node.setAttribute('id', 'suporka-dot');
            node.innerHTML = `${'<span></span>'.repeat(this.childrenLength)}`;
            this.carousal.appendChild(node);
            this.dot = document.getElementById('suporka-dot');
            this.dot.firstChild.setAttribute('class', 'suporka-dot--acitve');
        }
        // 判断是否开启自动轮播，如是则自动轮播
        if (this.option.autoScroll) this.requestAnimFrame(this.autoMove());
        this.addEventListener();
    }
    // 添加事件
    addEvent(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + type, handler);
        } else {
            element['on' + type] = handler;
        }
    }
    extend(o, n, override) {
        for (var p in n) {
            if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override))
                o[p] = n[p];
        }
    }
    addEventListener() {
        if (this.option.autoScroll) {
            this.addEvent(this.carousal, 'mouseover', event => {
                clearInterval(this.interval);
            });
            this.addEvent(this.carousal, 'mouseout', event => {
                this.autoMove();
            });
        }
        let prev = document.getElementById('suporka-prev-btn');
        let next = document.getElementById('suporka-next-btn');
        if (prev && next) {
            this.addEvent(prev, 'click', event => {
                this.prev();
            });
            this.addEvent(next, 'click', event => {
                this.next();
            });
        }
    }
    // prev上一张
    prev() {
        let movePx = this.carousal.offsetWidth;
        this.number -= 1;

        this.wrapper.style.left = 0 - movePx * this.number + 'px';
        if (this.number === 0) this.goLastOne();
        if (this.dot)
            this.setDotClass(
                this.dot.children,
                this.number - 1,
                'suporka-dot--acitve'
            );
    }
    next() {
        let movePx = this.carousal.offsetWidth;
        this.number += 1;
        this.wrapper.style.left = 0 - movePx * this.number + 'px';
        if (this.number === this.childrenLength + 1) this.startMove();
        if (this.dot)
            this.setDotClass(
                this.dot.children,
                this.number - 1,
                'suporka-dot--acitve'
            );
    }
    goLastOne() {
        this.number = this.childrenLength;
        this.timer = setTimeout(() => {
            this.wrapper.style.transition = `none`;
            this.wrapper.style.left =
                -this.carousal.offsetWidth * this.childrenLength + 'px';
            setTimeout(() => {
                this.wrapper.style.transition = `all ${
                    this.option.transition
                }s`;
            }, 100);
        }, this.option.transition * 1000);
    }
    // 初始化添加首尾子元素
    pushItem() {
        let movePx = this.carousal.offsetWidth;
        let first = this.wrapper.children[0].cloneNode(true);
        let last = this.wrapper.children[this.childrenLength - 1].cloneNode(
            true
        );
        let parent = this.wrapper;
        parent.appendChild(first);
        parent.insertBefore(last, parent.children[0]);
        this.wrapper.style.left = this.wrapper.offsetLeft - movePx + 'px';
    }
    // 自动轮播
    autoMove() {
        let movePx = this.carousal.offsetWidth;
        this.interval = setInterval(() => {
            this.number += 1;
            this.wrapper.style.left = 0 - movePx * this.number + 'px';
            if (this.number === this.childrenLength + 1) this.startMove();
            if (this.dot)
                this.setDotClass(
                    this.dot.children,
                    this.number - 1,
                    'suporka-dot--acitve'
                );
        }, this.option.time);
    }
    // 开始移动
    startMove() {
        this.number = 1;
        this.timer = setTimeout(() => {
            this.wrapper.style.transition = `none`;
            this.wrapper.style.left = -this.carousal.offsetWidth + 'px';
            setTimeout(() => {
                this.wrapper.style.transition = `all ${
                    this.option.transition
                }s`;
            }, 100);
        }, this.option.transition * 1000);
    }

    setDotClass(parent, index, cls) {
        if (!this.dot) return false;
        for (let i = 0; i < parent.length; i++) {
            removeClass(parent[i], cls);
        }
        addClass(parent[index], cls);
    }
    requestAnimFrame() {
        return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            }
        );
    }
}
function hasClass(ele, cls) {
    if (ele.className)
        return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    else return false;
}
function addClass(ele, cls) {
    if (!hasClass(ele, cls)) ele.className += ' ' + cls;
}
function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        let reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ');
    }
}

export default Carousal;
