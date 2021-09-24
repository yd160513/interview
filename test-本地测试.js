// isEqual 判断两个对象是否全相等
const obj1 = {
  a: 1,
  b: 2,
  c: {
    q: 1,
    w: 2,
    e: 3,
    r: [1, 2, 3]
  }
}

const obj2 = {
  a: 1,
  b: 2,
  c: {
    q: 1,
    w: 2,
    e: 3,
    r: [1, 2, 3]
  }
}

function isObject(obj) {
  return typeof obj === 'object' && obj !== null
}

function isEqual(obj1, obj2) {
  // 1. 两个参数不是对象则直接比较
  if (!isObject(obj1) || !isObject(obj2)) return obj1 === obj2

  /**
   * 2. obj1 等于 obj2 (调用 isEqual 时传入的两个参数是同一个对象)
   *    这一步在前是不是就可以省略掉判断这两个参数是不是对象了? 
   *      不可以，后边会调用 Object.keys() 判断这个两个参数的个数是否一样，这个时候如果是字符串的话就会把字符串的内容每一个都拆分开，这个时候就不对了
   *      Object.keys('123') => ['1', '2', '3']
   *      如果传入的是一个 null 的话就直接报错了
   */
  if (obj1 === obj2) return true

  // 3. 两个参数的 key 的个数是否一样
  const obj1Vals = Object.keys(obj1)
  const obj2Vals = Object.keys(obj2)
  // 个数不一样
  if (obj1Vals.length !== obj2Vals.length) return false

  // 4. 基于 obj1 中的 key 和 obj2 做递归对比
  for (const key in obj1) {
    if (Object.hasOwnProperty.call(obj1, key)) {
      // 递归调用 isEqual 对比当前 key 对应的 value 是否相等
      const res = isEqual(obj1[key], obj2[key])
      // 如果返回的是 true 则继续比较其他 key 这里不做任何处理
      // 如果返回的是 false 则直接 return 也就不用继续比较其他 key 了
      if (!res) {
        return false
      }
    }
  }
  // 5. 循环中没有 return 的话说明 这两个参数是完全相等的，因为如果有不相等的值在 for 循环中就被 return 了
  return true
}

// console.log(isEqual(obj1, obj2))

// ------------------------------------------------------------------------------------------------------------------------

// pop push unshift shift 的区别
// const arr = [1, 2, 3, 4, 5]
// const popVal = arr.pop()
// console.log(arr) // [ 1, 2, 3, 4 ]
// console.log(popVal) // 5

// const arr = [1, 2, 3, 4, 5]
// const arrLen = arr.push(0)
// console.log(arr) // [ 1, 2, 3, 4, 5, 0 ]
// console.log(arrLen) // 6

// const arr = [1, 2, 3, 4, 5]
// const arrLen = arr.unshift(0)
// console.log(arr) // [ 0, 1, 2, 3, 4, 5 ]
// console.log(arrLen) // 6

// const arr = [1, 2, 3, 4, 5]
// const arrLen = arr.shift()
// console.log(arr) // [ 2, 3, 4, 5 ]
// console.log(arrLen) // 1

// ------------------------------------------------------------------------------------------------------------------------
// 数组的纯函数: concat map filter slice
// const arr = [1, 2, 3, 4, 5]
// const newArr = arr.concat([9, 8, 7])
// console.log(arr) // [ 1, 2, 3, 4, 5 ]
// console.log(newArr) // [ 1, 2, 3, 4, 5, 9, 8, 7 ]

// const arr = [1, 2, 3, 4, 5]
// const newArr = arr.map(item => item * 4)
// console.log(arr) // [ 1, 2, 3, 4, 5 ]
// console.log(newArr) // [ 4, 8, 12, 16, 20 ]

// const arr = [1, 2, 3, 4, 5]
// const newArr = arr.filter(item => item > 2)
// console.log(arr) // [ 1, 2, 3, 4, 5 ]
// console.log(newArr) // [ 3, 4, 5 ]

// const arr = [1, 2, 3, 4, 5]
// const newArr = arr.slice(0, 3)
// console.log(arr) // [ 1, 2, 3, 4, 5 ]
// console.log(newArr) // [ 1, 2, 3 ]

// ------------------------------------------------------------------------------------------------------------------------
// slice 和 splice 的区别
// slice 有第二个参数的时候，返回的数组是不包含第二个参数对应值的
// const arr = [1, 2, 3, 4, 5]
// const arr2 = arr.slice(2, 4) // [3, 4]
// console.log(arr, arr2)

// 从后往前截取传入负数即可
// const arr = [1, 2, 3, 4, 5]
// const arr2 = arr.slice(-2) // [4, 5]
// console.log(arr, arr2)

// splice
// const arr = [1, 2, 3, 4, 5]
// // 将从 1 一个索引开始删除 2 个元素，将 a 和 b 插入到从 1 开始的位置
// const arr2 = arr.splice(1, 2, 'a', 'b')
// console.log(arr)
// console.log(arr2)

// ------------------------------------------------------------------------------------------------------------------------
/**
 * [10, 20, 30].map(parseInt) 的执行结果 => [ 10, NaN, NaN ]
 * [10, 20, 30].map(parseInt) 等同于: [10, 20, 30].map((item, index) => parseInt(item, index))
 * parseInt 第二个参数的规则: 
 *    第二个参数表示要解析的数字的基数。
 *    该值介于 2 ~ 36 之间。如果省略该参数或其值为 0，则数字将以 10 为基础来解析。
 *    如果它以 “0x” 或 “0X” 开头，将以 16 为基数。如果该参数小于 2 或者大于 36，则 parseInt() 将返回 NaN。
 * 执行过程:
 * 1. parseInt 第二个参数为 0 则表示 10 进制， 结果为 10
 * 2. parseInt 第二个参数为 1，而第二个参数的范围必须是在 2 - 36 之间，所以这是一个无效参数，返回 NaN
 * 3. parseInt 第二个参数为 2，这个时候第二个参数是正确的，但是第一个参数 3 是不合法的二进制数组，返回 NaN
 */

// ------------------------------------------------------------------------------------------------------------------------
// 函数和变量重名，哪个优先级更高一些，最后会采用哪个 => 变量
// var test = '变量'

// function test() {
//   console.log('test fn')
// }

// console.log(test) // 变量

// ------------------------------------------------------------------------------------------------------------------------
// 手写 trim 方法
// String.prototype.myTrim = function () {
//   // \s => 只要出现空白就匹配
//   // \S => 非空白就匹配
//   // + => 一个或多个
//   return this.replace(/^\s+/, '').replace(/\s+$/, '')
// }
// const str = '    哈哈      '
// console.log(str.length) // 12
// console.log(str.myTrim().length) // 2

// ------------------------------------------------------------------------------------------------------------------------
// 手写 max 方法
function max() {
  // 获取所有参数
  const args = Array.prototype.slice.call(arguments)
  console.log(args)
  let maxVal

  args.forEach(item => {
    // !maxVal: 第一次循环 maxVal 是 undefined 所以需要将 item 赋值给它
    // maxVal < item: item 大于上一次的 maxVal
    if (!maxVal || maxVal < item) maxVal = item
  })
  return maxVal
}

// console.log(max(1, 2, 3, 99, 20, 10, 30))

// ------------------------------------------------------------------------------------------------------------------------
/**
 * 手写 flatern 函数，将多维数组转换位一维数组
 * 整体思路:
 *    1. 将二维数组降为一维数组可通过: Array.prototype.concat.apply([], targetArr)
 *    2. targetArr 就是被降维的数组
 *    3. 如果数组中还有数组则递归调用 1
 */
function flat(arr) {
  // 1. arr 中是否还有数组
  const isDeep = arr.some(item => item instanceof Array)
  // 2. 没有数组了说明是一个一维数组，可以 return
  if (!isDeep) return arr
  // 3. 有数组则处理
  const res = Array.prototype.concat.apply([], arr)
  // 4. 递归调用处理
  return flat(res)
}
const arr1 = [1, 2, 3, [5, 6, 7, [8, 9, 0, 10, 11, [12, 13, 14, 15]]]]
// console.log(flat(arr1))

/**
 * 为什么通过 Array.prototype.concat.apply([], arr) 可以将二维数组降维？
 *    1. apply 的第二个参数会被作为参数一次传入到 concat 中，相当于是将 arr 给解构了
 *        相当于 Array.prototype.concat.apply([], [1, 2, 3, [5, 6, 7]]) 会转换成 [].concat(1, 2, 3, [5, 6, 7])
 *    2. concat 它的参数如果是一个数组的话，它会将数组中的每一项作为参数放到 concat 的返回值中
 *        相当于 [].concat(1, 2, 3, [5, 6, 7]) 会转换成 [ 1, 2, 3, 5, 6, 7 ]
 *        对应到 MDN 中的解释: concat方法创建一个新的数组，它由被调用的对象中的元素组成，每个参数的顺序依次是该参数的元素（如果参数是数组）或参数本身（如果参数不是数组）。它不会递归到嵌套数组参数中。
 */
// const arr = [1, 2, 3, [5, 6, 7]]
// const arr2 = []
// console.log(Array.prototype.concat.apply(arr2, arr)) // [ 1, 2, 3, 5, 6, 7 ]
// console.log(arr2.concat(arr)) // [ 1, 2, 3, [ 5, 6, 7 ] ]
// console.log(arr2.concat(1, 2, 3, [5, 6, 7])) // [ 1, 2, 3, 5, 6, 7 ]

// ------------------------------------------------------------------------------------------------------------------------
// 数组去重
// 1. for 循环的方式
function unique(arr) {
  const result = []
  arr.forEach(item => {
    if (!result.includes(item)) {
      result.push(item)
    }
  })
  return result
}

// 2. new set()
function unique(arr) {
  return [...new Set(arr)]
}

const arr = [1, 1, 1, 2, 3, 4, 5, 6, 99, 0, 2, 44, 2, 333, 444, 9, 9, 9]
// console.log(unique(arr))

// ------------------------------------------------------------------------------------------------------------------------
// 深拷贝
function deepClone(obj) {
  if (!obj || typeof obj !== 'object') return obj
  const result = typeof Array.isArray(obj) ? [] : {}
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      result[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]
    }
  }
  return result
}

function isObject(obj) {
  return typeof obj === 'object' || obj !== null
}

const deepCloneObj = {
  a: 1,
  b: 2,
  c: {
    q: 1,
    w: 2,
    e: 3,
    r: [1, 2, 3]
  }
}

// const deepCloneRes = deepClone(deepCloneObj)
// console.log('deepClone(deepCloneObj) =>', deepCloneRes)
// deepCloneRes.a = 123
// console.log('deepClone(deepCloneObj) =>', deepCloneRes)
// console.log('deepCloneObj =>', deepCloneObj)

// ------------------------------------------------------------------------------------------------------------------------
/**
 * 编写 parse 函数，实现通过字符串访问对象里属性的值
 * 第一种解决方案
 */
function parse(obj, str) {
  /**
   * 解析: [Function](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function)
   *    new Function ([arg1[, arg2[, ...argN]],] functionBody)
   *    最终得到一个匿名函数，最后一个参数是函数内部的执行语句，前边的参数全部都是匿名函数的参数
   * eg: 
   *    new Function('obj', `return obj.a`) 返回结果是:
   *    function anonymous(obj) {
   *      return obj.a
   *    }
   */
  const fn = new Function('obj', `return obj.${str}`)
  return fn(obj)
}
/**
 * 第二种解决方案
 */
function parse(obj, str) {
  /**
   * d+: 最少有一个数字
   * (): 对要替换的地方进行分区
   * .$1: 第一个 () 就是第一个分区，对应的就是 $1, 意思就是将第一个分区替换为 .
   * g: 全局匹配
   */
  str = str.replace(/\[(\d+)\]/g, `.$1`)
  // 将 str 按 . 做分割，分别获取对应的值
  const strArr = str.split('.')
  strArr.forEach(item => {
    /**
     * for 循环中 obj = obj[item] 操作的原因:
     * 因为 parse 这个方法不是循环调用，所以可以直接更改 obj 这个对象；
     * 这样在遇到嵌套对象的时候，第一次获取到外层的对象，第二次就可以去这个对象里边的值了
     * eg:
     *  str = 'b.c'
     *  const strArr = str.split('.') // [b, c]
     *  // 第一次循环 strArr 的时候 obj 如下:
     *  obj = {
     *    a: 1,
     *    b: { c: 2 },
     *    d: [1, 2, 3],
     *    e: [
     *      {
     *        f: [4, 5, 6]
     *      }
     *    ]
     *  }
     *  // 当第一次循环 strArr 结束之后，obj 如下:
     *  obj = { c: 2 }
     *  // 第二次循环 strArr 的时候，循环的 item 就是 c 这个时候正好从 obj 中获取 c 的值
     */
    obj = obj[item]
  })
  return obj
}

const obj = {
  a: 1,
  b: { c: 2 },
  d: [1, 2, 3],
  e: [
    {
      f: [4, 5, 6]
    }
  ]
}

const r1 = parse(obj, 'a')
const r2 = parse(obj, 'b.c')
const r3 = parse(obj, 'd[2]')
const r4 = parse(obj, 'e[0].f[0]')

// console.log(r1)
// console.log(r2)
// console.log(r3)
// console.log(r4)

// ------------------------------------------------------------------------------------------------------------------------
// call
Function.prototype.myCall = function (context, ...args) {
  context = context || window
  const fn = Symbol()
  context[fn] = this
  const res = context[fn](...args)
  delete context[fn]
  return res
}

// apply
Function.prototype.myApply = function (context, args) {
  context = context || window
  const fn = Symbol()
  context[fn] = this
  const res = context[fn](...args)
  delete context[fn]
  return res
}

// const obj = {
//   a:1
// }
// global.a = 1
// function test(q, w, e) {
//   console.log(this.a)
//   console.log(q)
//   console.log(w)
//   console.log(e)
// }
// test('你好', '2', 3)
// test.myCall(obj, 'hah', '123', '124213')
// test.myApply(obj, ['hah', '123', '124213'])

function fn1() {
  console.log(1)
}
function fn2() {
  console.log(2)
}
// fn1.myCall.myCall(fn2)

// ------------------------------------------------------------------------------------------------------------------------
// bind
Function.prototype.myBind = function (context) {
  context = context || window
  const args = [...arguments].slice(1)
  const _self = this
  return Fn = () => {
    if (this instanceof Fn) new _self(...args, ...arguments)
    return _self.myApply(context, args.concat(...arguments))
  }
}

// ------------------------------------------------------------------------------------------------------------------------
// Object.create
Object.prototype.myCrate = function (prototype) {
  function F() { }
  F.prototype = prototype
  return new F()
}

// ------------------------------------------------------------------------------------------------------------------------
/**
  实现这个 add 函数
  console.log(add(1, 2, 3, 4, 5))
  console.log(add(1, 2)(3)(4, 5))
  console.log(add(1)(2)(3)(4)(5))
 */
// 第一种解决方案: 通过闭包来缓存参数个数，当参数个数达到指定个数时进行参数求和
const add = ((total) => {
  // 缓存
  let args = []
  // 这里利用闭包来缓存参数
  return _add = (...innerArgs) => {
    // 将缓存中的参数和传入的参数合并
    args = [...args, ...innerArgs]
    // 当总参数个数等于 total 的时候进行求和操作
    if (args.length === total) {
      const res = args.reduce((prevVal, currVal) => prevVal + currVal, 0)
      /**
       * 这里的清空是为了解决多次调用 add 的问题:
       *    因为当进行求和的时候肯定是当前整个流程就结束了，所以要将闭包中的缓存(argTotalArr) 清除掉，否则下一次再调用 add 的时候还会访问到上一次的缓存
       *    否则在下一次调用 add 方法的时候，argTotalArr 内部还会存储着上一次的值，
       *    但是上一次调用 add 的内容和当前这次已经完全没有关系了，所以在每次求值之后要将闭包内的数据清空。
       */
      args = []
      return res
    }
    // 参数不够的话则将 _add 方法继续抛出，接收后续的参数
    else {
      return _add
    }
  }
})(5)

// console.log(add(1, 2, 3, 4, 5))
// console.log(add(1, 2, 3)(4, 5))
// console.log(add(1)(2)(3)(4)(5))

// 第二种解决方案: 通过 bind 函数来缓存参数， 利用 alert() 方法会默认调用 toString() 方法，这里来重写 toString() 方法把求值放到这里。
function add2(...args) {
  const _add = add2.bind(null, ...args)
  _add.toString = () => {
    return args.reduce((prevVal, currVal) => prevVal + currVal, 0)
  }
  return _add
}
// alert(add2(1, 2, 3, 4, 5))
// alert(add2(1, 2, 3)(4, 5))
// alert(add2(1)(2)(3)(4)(5))

/**
 * 第三种解决方案: 通过函数柯里化实现
 * 柯里化: 柯里化（Currying）是把接受多个参数的函数变换成接受一个单一参数(最初函数的第一个参数)的函数，并且返回接受余下的参数且返回结果的新函数的技术
 */
// 最终求值的方法
function _add(a, b, c, d, e) {
  return a + b + c + d + e
}
// 柯里化函数
// 这里也是利用了缓存参数个数，比较参数个数是否和求值方法的形参个数相等
function curry(fn, ...args) {
  // 参数个数不够的时候
  if (args.length < fn.length) {
    // 这里向外抛出一个函数用来继续接收参数
    return (...innerArgs) => curry(fn, ...innerArgs, ...args)
  }
  else {
    // 进行求和
    return fn(...args)
  }
}

const add3 = curry(_add)
console.log(add3(1, 2, 3, 4, 5))
console.log(add3(1, 2, 3)(4, 5))
console.log(add3(1)(2)(3)(4)(5))

// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------
// /**
//   实现这个 add 函数
//   console.log(add(1, 2, 3, 4, 5))
//   console.log(add(1, 2)(3)(4, 5))
//   console.log(add(1)(2)(3)(4)(5))
//  */
// // 第一种解决方案: 通过闭包来缓存参数个数，当参数个数达到指定个数时进行参数求和
// const add = (function (count) {
//   console.log(count)
//   let argTotalArr = []
//   return _add = (...innerArgs) => {
//     argTotalArr = [...argTotalArr, ...innerArgs]
//     // 参数总数够了的时候进行求和
//     if (argTotalArr.length === count) {
//       const result = argTotalArr.reduce((prevVal, currVal) => prevVal + currVal)
//       /**
//        * 这里的清空是为了解决多次调用 add 的问题:
//        *    因为 argTotalArr 属于闭包内的数据，当我们求完值之后要主动的将其清空调，
//        *    否则在下一次调用 add 方法的时候，argTotalArr 内部还会存储着上一次的值，
//        *    但是上一次调用 add 的内容和当前这次已经完全没有关系了，所以在每次求值之后要将闭包内的数据清空。
//        */
//       argTotalArr = []
//       return result
//     }
//     // 参数总数不够的时候继续递归调用
//     else {
//       return _add
//     }
//   }
// })(5)
// // console.log(add(1, 2, 3, 4, 5))
// // console.log(add(1, 2)(3)(4, 5))
// // console.log(add(1)(2)(3)(4)(5))

// // 第二种解决方案: 通过 bind 函数来缓存参数，利用 alert() 方法会默认调用 toString() 方法，通过 toString() 方法来求值
// function add2(...args) {
//   const _add = add.bind(null, ...args)
//   _add.toString = function () {
//     return args.reduce((prevVal, currVal) => prevVal + currVal)
//   }
//   return _add
// }
// // alert(add(1, 2, 3, 4, 5))
// // alert(add(1, 2)(3)(4, 5))
// // alert(add(1)(2)(3)(4)(5))

// /**
//  * 第三种解决方案: 通过函数柯里化实现
//  * 柯里化: 柯里化（Currying）是把接受多个参数的函数变换成接受一个单一参数(最初函数的第一个参数)的函数，并且返回接受余下的参数且返回结果的新函数的技术
//  */
// // 最终求值的方法
// function _add(a, b, c, d, e) {
//   return a + b + c + d + e
// }

// // 柯里化函数
// // 这里也是利用了缓存参数个数，比较参数个数是否和求值方法的形参个数相等
// function curry(fn, ...args) {
//   // 如果参数个数和求值方法形参个数相等则求值
//   if (fn.length === args.length) {
//     return fn(...args)
//   }
//   // 反之继续调用
//   else {
//     return curry(fn, ...args)
//   }
// }

// const add3 = curry(_add)
// console.log(add3(1, 2, 3, 4, 5))
// console.log(add3(1, 2)(3)(4, 5))
// console.log(add3(1)(2)(3)(4)(5))

