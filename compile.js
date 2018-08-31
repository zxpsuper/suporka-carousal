class Compile {
  constructor(el, vm) {
    //el为MVVM实例作用的根节点
    this.el = this.isElementNode(el) ? el : document.querySelector(el);
    this.vm = vm;
    //如果元素能取到才开始编译
    if (this.el) {
      //1.先把这些真实DOM移入到内存中fragment
      let fragment = this.node2fragment(this.el);
      //2.编译=>提取想要的元素节点 v-model或文本节点{{}}
      this.compile(fragment);
      //3.把编译好的fragment塞到页面中
      this.el.appendChild(fragment);
    }
  }
  /*辅助方法*/
  //判断是否是元素
  isElementNode(node) {
    return node.nodeType === 1;
  }
  //是否是指令
  isDirective(name) {
    return name.includes("v-");
  }
  /*核心方法*/
  //将el中的内容全部放到内存中
  node2fragment(el) {
    //文档碎片－内存中的文档碎片
    let fragment = document.createDocumentFragment();
    let firstChild;
    while ((firstChild = el.firstChild)) {
      fragment.appendChild(firstChild);
    }
    return fragment; //内存中的节点
  }
  //编译元素
  compileElement(node) {
    //获取节点所有属性
    let attrs = node.attributes;
    Array.from(attrs).forEach(attr => {
      //判断属性名是不是包含v-
      let attrName = attr.name;
      if (this.isDirective(attrName)) {
        //取到对应的值放到节点中
        let expr = attr.value;
        //指令可能有多个，如v-model、v-text、v-html，所以要取相应的方法进行编译
        let [, type] = attrName.split("-"); //解构赋值[v,model]
        CompileUtil[type](node, this.vm, expr);
      }
    });
  }
  compileText(node) {
    //带{{}}
    let expr = node.textContent;
    let reg = /\{\{([^}]+)\}\}/g;
    if (reg.test(expr)) {
      CompileUtil["text"](node, this.vm, expr);
    }
  }
  compile(fragment) {
    //当前父节点节点的子节点，包含文本节点，类数组对象
    let childNodes = fragment.childNodes;
    // 转换成数组并循环判断每一个节点的类型
    Array.from(childNodes).forEach(node => {
      if (this.isElementNode(node)) {
        //是元素节点
        //编译元素
        this.compileElement(node);
        //如果是元素节点，需要再递归
        this.compile(node);
      } else {
        //是文本节点
        //编译文本
        this.compileText(node);
      }
    });
  }
}

//编译方法，暂时只实现v-model及{{}}对应的方法
CompileUtil = {
  getVal(vm, expr) {
    expr = expr.split(".");
    return expr.reduce((prev, next) => {
      //vm.$data.a.b
      return prev[next];
    }, vm.$data);
  },
  getTextVal(vm, expr) {
    //获取编译后的文本内容
    return expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
      return this.getVal(vm, arguments[1]);
    });
  },
  text(node, vm, expr) {
    //文本处理
    let updateFn = this.updater["textUpdater"];
    //将{{message.a}}转为里面的值
    let value = this.getTextVal(vm, expr);
    //用正则匹配{{}}，然后将其里面的值替换掉
    expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
      //解析时遇到模板中需要替换为数据值的变量时，应添加一个观察者
      //当变量重新赋值时，调用更新值节点到Dom的方法
      //new（实例化）后将调用observe.js中get方法
      new Watcher(vm, arguments[1], newValue => {
        //如果数据变化了文本节点需要重新获取依赖的属性更新文本中的内容
        updateFn && updateFn(node, this.getTextVal(vm, expr));
      });
    });
    //如果有文本处理方法，则执行
    updateFn && updateFn(node, value);
  },
  setVal(vm, expr, value) {
    //[message,a]给文本赋值
    expr = expr.split("."); //将对象先拆开成数组
    //收敛
    return expr.reduce((prev, next, currentIndex) => {
      //如果到对象最后一项时则开始赋值，如message:{a:1}将拆开成message.a = 1
      if (currentIndex === expr.length - 1) {
        return (prev[next] = value);
      }
      return prev[next]; // TODO
    }, vm.$data);
  },
  model(node, vm, expr) {
    //输入框处理
    let updateFn = this.updater["modelUpdater"];
    //加一个监控，当数据发生变化，应该调用这个watch的callback
    new Watcher(vm, expr, newValue => {
      //当值变化后会调用cb，将新值传递回来
      updateFn && updateFn(node, this.getVal(vm, expr));
    });
    //给输入添加input事件,输入值时将触发
    node.addEventListener("input", e => {
      let newValue = e.target.value;
      this.setVal(vm, expr, newValue);
    });
    //如果有文本处理方法，则执行
    updateFn && updateFn(node, this.getVal(vm, expr));
  },
  updater: {
    //更新文本
    textUpdater(node, value) {
      node.textContent = value;
    },
    //更新输入框的值
    modelUpdater(node, value) {
      node.value = value;
    }
  }
};
