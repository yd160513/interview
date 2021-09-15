// 调用方式: fn.apply(obj, [...])
Function.prototype.myApply = function(context) {
  // 获取第一个参数
  context = context || window
  // 获取第二个参数
  const secArg = arguments[1]
  // 用传入的第一个参数法来调用调用 myApply 的函数
  const fn = Symbol()
  context[fn] = this
  let result
  if (secArg) {
    result = context.fn(...secArg)
  } else {
    result = context.fn()
  }
  delete context.fn
  return result
}

// fn.bind(obj, 1, 2, 3, 4, ...)
// fn.bind(obj, 1, 2, 3, ...)(123)
Function.prototype.myBind = function(context) {
  // 获取后边的参数
  const args = [...arguments].slice(1)
  // 获取 this 指向
  context = context || window
  const fn = Symbol()
  context[fn] = this
  // 因为 bind 是返回一个函数，函数就可以被 new
  return function Fn() {
    if (this instanceof Fn) {
      // 因为函数可以被 new 所以需要拼接 Fn 的参数 arguments
      // 因为 new 的 this 是指向实例的，所以需要忽略调用 bind 时传入的 this
      return new fn(args, ...arguments)
    }
    // 普通的函数通过 apply 来实现
    return fn.myApply(context, ...args.concat(...arguments))
  }
}
