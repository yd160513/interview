// 调用方式: fn.apply(obj, [...])
Function.prototype.myApply = function (context) {
  // 获取第一个参数
  // context = context || window
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
Function.prototype.myBind = function (context) {
  // 获取后边的参数
  const args = [...arguments].slice(1)
  // 获取 this 指向
  // context = context || window
  const fn = this
  // 因为 bind 是返回一个函数，函数就可以被 new
  const F = function () {
    // this instanceof F: 这里的判断相当于 new 的是 F 这个函数
    if (this instanceof F) {
      // 因为函数可以被 new 所以需要拼接 F 的参数 arguments
      // 因为 new 的 this 是指向实例的，所以需要忽略调用 bind 时传入的 this
      return new fn(...args, ...arguments)
    }
    // 普通的函数通过 apply 来实现
    return fn.apply(context, args.concat(...arguments))
  }
  //继承一下绑定函数属性的值 
  function Foo() { }
  Foo.prototype = this.prototype;
  //使用一个空函数进行中转。 
  F.prototype = new Foo();
  return F
}

Function.prototype.myBind2 = function (context, ...outerArgs) {
  // 第一版: 不支持 new
  // return (...innerArgs) => {
  //   return this.call(context, ...outerArgs, ...innerArgs)
  // }
  // 第二版
  // 缓存调用 bind 的函数
  const _selfFun = this;
  // 定义 bind 返回的函数
  const Fun = function (...innerArgs) {
    // _selfFun instanceof Fun: 这里的这个判断相当于 new 的是调用 bind 的函数的函数
    // _selfFun instanceof Fun: 外侧 new 的是 Fun，在 Fun 内部为什么要判断 _self 是不是 Fun 的实例呢
    if (_selfFun instanceof Fun) return new _selfFun(...outerArgs, ...innerArgs)
    return _selfFun.call(context, ...outerArgs.concat(...innerArgs))
  }
  Fun.prototype = Object.create(_selfFun.prototype)
  return Fun
}

// function sum(...args) {
//   return this.prefix + (args.reduce((prevValue, currValue) => prevValue + currValue, 0))
// }
// let obj = {
//   prefix: `$`
// }
// let bindSum = sum.myBind(obj, 1, 2, 3)
// console.log(bindSum(4, 5))

function Point(x, y) {
  this.x = x
  this.y = y
}
Point.prototype.toString = function () {
  return `${this.x},${this.y}`
}
/**
 * 定义了一个 Point 函数，接收两个参数。Point 调用 bind，只传入 Point 的第一个参数。然后定义 YPoint 来接收 bind 的返回值，
 * 这个时候再调用 YPoint 传入一个参数，这个时候这个参数就是 Point 的第二个参数了
 * function Point(x, y) {}
 * let YPoint = Point.bind(null, 1) // 传入 Point 的第一个参数
 * let axiosPoint = new YPoint(2) // 传入 Point 的第二个参数
 */

let emptyObj = {}

console.log('系统方法: ----------------')
// 系统方法
let YPoint3 = Point.bind(null, 1)
let axiosPoint3 = new YPoint3(2)
console.log(axiosPoint3.toString()) // 1,2
console.log(axiosPoint3 instanceof Point) // true
console.log(axiosPoint3 instanceof YPoint3) // true

console.log('myBind: ----------------')
// let YPoint = Point.bind(null, 1)
let YPoint = Point.myBind(null, 1)
let axiosPoint1 = new YPoint(2)
console.log(axiosPoint1.toString()) // 1,2
console.log(axiosPoint1 instanceof Point) // true
console.log(YPoint instanceof Point) // true
console.log(axiosPoint1 instanceof YPoint) // false

console.log('myBind2: ----------------')
// let YPoint = Point.bind(null, 1)
let YPoint2 = Point.myBind2(null, 1)
let axiosPoint2 = new YPoint2(2)
console.log(axiosPoint2.toString()) // [object Object]
console.log(axiosPoint2 instanceof Point) // true
console.log(axiosPoint2 instanceof YPoint2) // true
