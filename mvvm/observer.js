// observer.js利用Object.defineProerty来劫持数据，结合发布订阅模式来响应数据变化。
class Observer {
  constructor(data) {
    this.observe(data);
  }
  observe(data) {
    //将data数据原有属性改成set和get的形式，如果data不为对象，则直接返回
    if (!data || typeof data !== "object") {
      return;
    }
    //要将数据一一劫持，先获取data中的key和value
    Object.keys(data).forEach(key => {
      //劫持
      this.defineReactive(data, key, data[key]);
      this.observe(data[key]); //递归劫持，data中的对象
    });
  }
  defineReactive(obj, key, value) {
    let that = this;
    let dep = new Dep(); //每个变化的数据都会对应一个数组，这个数组是存放所有更新的操作
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      //取值时会触发的方法
      get() {
        //当取值时调用的方法
        Dep.target && dep.addSub(Dep.target);
        return value;
      },
      //赋值时会触发的方法
      set(newValue) {
        console.log(Dep.target)
        //给data中的属性赋新值
        if (newValue !== value) {
          //如果是对象继续劫持
          that.observe(newValue);
          value = newValue;
          dep.notify(); //通知所有人数据更新了
        }
      }
    });
  }
}

//
class Dep {
  constructor() {
    //订阅的数组
    this.subs = [];
  }
  //添加订阅
  addSub(watcher) {
    this.subs.push(watcher);
  }
  notify() {
    //调用watcher的更新方法
    this.subs.forEach(watcher => {
      console.log(watcher)
      console.log("arr" + this.subs)
      return watcher.update()
    });
  }
}
