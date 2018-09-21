// import 'babel-polyfill'
class Carousal {
  constructor(userOption) {
    this.option = {
      time: 3000,
      transition: 0.8,
      childrenLength: document.getElementById("wrapper").children.length,
      autoScroll: true
    };
    // 当前索引
    this.number = 1;
    // 定时器
    this.timer = null;
    this.interval = null;
    this.carousal = document.getElementById("carousal");
    this.wrapper = document.querySelector("#wrapper");
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
    this.wrapper.style["-moz-transition"] = `all ${this.option.transition}s`;
    this.wrapper.style["-webkit-transition"] = `all ${this.option.transition}s`;
    this.wrapper.style["-o-transition"] = `all ${this.option.transition}s`;
    // 首尾添加元素
    this.pushItem();
    // 判断是否开启自动轮播，如是则自动轮播
    if (this.option.autoScroll) this.requestAnimFrame(this.autoMove());
    this.addEventListener();
  }
  // 添加事件
  addEvent(element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent("on" + type, handler);
    } else {
      element["on" + type] = handler;
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
      this.addEvent(this.carousal, "mouseover", event => {
        clearInterval(this.interval);
      });
      this.addEvent(this.carousal, "mouseout", event => {
        this.autoMove();
      });
    }
  }
  // 初始化添加首尾子元素
  pushItem() {
    let movePx = this.carousal.offsetWidth;
    let first = this.wrapper.children[0].cloneNode(true);
    let last = document
      .querySelector("#wrapper")
      .children[this.option.childrenLength - 1].cloneNode(true);
    let parent = this.wrapper;
    parent.appendChild(first);
    parent.insertBefore(last, parent.children[0]);
    document.getElementById("wrapper").style.left =
      document.getElementById("wrapper").offsetLeft - movePx + "px";
  }
  // 自动轮播
  autoMove() {
    let movePx = this.carousal.offsetWidth;
    this.interval = setInterval(() => {
      this.number += 1;
      document.getElementById("wrapper").style.left =
        0 - movePx * this.number + "px";
      if (this.number === this.option.childrenLength + 1) this.startMove();
    }, this.option.time);
  }
  // 开始移动
  startMove() {
    this.timer = setTimeout(() => {
      this.wrapper.style.transition = `none`;
      document.getElementById("wrapper").style.left =
        -this.carousal.offsetWidth + "px";
      setTimeout(() => {
        this.wrapper.style.transition = `all ${this.option.transition}s`;
      }, 50);
      this.number = 1;
    }, this.option.transition * 1000);
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

export default Carousal;
