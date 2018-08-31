// vm.$on
export function eventsMixin(Vue) {
  const hookRE = /^hook:/;
  //参数类型为字符串或者字符串组成的数组
  Vue.prototype.$on = function(event, fn) {
    const vm = this;
    // 传入类型为数组
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        this.$on(event[i], fn);
        //递归并传入相应的回调
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm;
  };

  // vm.$emit
  Vue.prototype.$emit = function(event) {
    const vm = this;
    if (process.env.NODE_ENV !== "production") {
      const lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          `Event "${lowerCaseEvent}" is emitted in component ` +
            `${formatComponentName(
              vm
            )} but the handler is registered for "${event}". ` +
            `Note that HTML attributes are case-insensitive and you cannot use ` +
            `v-on to listen to camelCase events when using in-DOM templates. ` +
            `You should probably use "${hyphenate(
              event
            )}" instead of "${event}".`
        );
      }
    }
    let cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      const args = toArray(arguments, 1);
      for (let i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args); // 执行之前传入的回调
        } catch (e) {
          handleError(e, vm, `event handler for "${event}"`);
        }
      }
    }
    return vm;
  };
}
