// mvvm.js主要用来劫持数据，及将节点挂载到$el上，数据挂载到$data上。
class MVVM {
  constructor(options) {
    //将参数挂载到MVVM实例上
    this.$el = options.el;
    this.$data = options.data;
    //如果有要编译的模板就开始编译
    if (this.$el) {
      //数据劫持－就是把对象的所有属性改成get和set方法
      new Observer(this.$data);
      //将this.$data上的数据代理到this上
      this.proxyData(this.$data);
      //用数据和元素进行编译
      new Compile(this.$el, this);
    }
  }
  proxyData(data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        get() {
          return data[key];
        },
        set(newValue) {
          data[key] = newValue;
        }
      });
    });
  }
}
