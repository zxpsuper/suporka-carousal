class Carousal {
  constructor(userOption) {
    this.option = {
      time: 3000,
      transition: 0.8,
      childrenLength: document.getElementById("wrapper").children.length,
      autoScroll: true
    };
    this.carousal = document.getElementById("carousal");
    this.wrapper = document.querySelector("#wrapper");
    this.init(userOption);
    this.number = 1
  }
  init(userOption) {
    // 合并用户配置
    Object.assign(this.option, userOption);
    this.wrapper.style.transition = `all ${this.option.transition}s`;
    // 首尾添加元素
    this.pushItem();
    // 开始移动
    if (this.option.autoScroll) this.requestAnimFrame(this.autoMove());
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
    setInterval(() => {
      this.number += 1;
      document.getElementById("wrapper").style.left =
        0 - movePx * this.number + "px";
      if (this.number === this.option.childrenLength + 1) this.startMove()
    }, this.option.time);
  }
  // 开始移动
  startMove() {
    this.timer = setTimeout(() => {
      this.wrapper.style.transition = `none`;
      document.getElementById("wrapper").style.left = -this.carousal.offsetWidth + "px";
      setTimeout(() => {
        this.wrapper.style.transition = `all ${this.option.transition}s`;
      }, 10);
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
