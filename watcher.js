//观察者的目的就是给需要变化的元素加一个观察者，当数据变化后执行对应的方法
class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;
    //获取旧的值
    this.value = this.get();
  }
  getVal(vm, expr) {
    expr = expr.split(".");
    return expr.reduce((prev, next) => {
      //vm.$data.a.b
      return prev[next];
    }, vm.$data);
  }
  get() {
    Dep.target = this; //将实例赋给target
    let value = this.getVal(this.vm, this.expr);
    Dep.target = null; //
    return value; //将旧值返回
  }
  // 对外暴露的方法
  update() {
    //值变化时将会触发update，获取新值，旧值已保存在value中
    let newValue = this.getVal(this.vm, this.expr);
    let oldValue = this.value;
    if (newValue !== oldValue) {
      this.cb(newValue); //调用watch的回调函数
    }
  }
}
