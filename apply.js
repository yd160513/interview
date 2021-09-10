
Function.prototype.myApply = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  context = context || window
  context.fn = this
  let result
  // 处理参数和 call 有区别
  if (arguments[1]) {
    result = context.fn(...arguments[1])
  } else {
    result = context.fn()
  }
  delete context.fn
  return result
}


// 接收传入的对象，也就是 this 指向
Function.prototype.myApply= function(context) {
  // 获取 this 指向
  context = context || window
  // 这里用来改变 this 指向，使用 context 来调用 fn，this 也就指向了 context
  context.fn = this
  // [...arguments] 可以将类数组 arguments 转换为数组
  // slice() 返回的是一个数组
  const args = [...arguments].slice(1)
  // args 将原始参数包在了数组中，这里需要取到用户传入的参数
  const result = context.fn(...args)

  delete context.fn
  return result
}

// const/let 定义的值不会绑定在 window 上
// var 定义的变量在浏览器环境会默认绑定在 window 上
// 如果 js 文件是通过 node 跑起来的则是 node 环境，node 环境下不存在 window，只有 global，但是 var 声明的变量不会赋值到 global 上
// 所以，当在全局环境下定义 var a = 1， 然后在函数中通过 this.a 访问 a 是访问不到的，会返回 undefined
global.a = 2
var a = 2
function fn() {
  console.log(this.a)
}


const obj = {
  a: 1
}

// 调用方式
fn()
fn.myApply(obj)
