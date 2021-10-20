// class MyPromise {
//   constructor(executor) {
//     // 状态
//     this.status = 'pending'
//     // 成功时返回的值
//     this.successInfo = undefined
//     // 失败时返回的值
//     this.failInfo = undefined

//     try {
//       executor(this.resolve, this.reject)
//     } catch (error) {
//       this.reject(error)
//     }
//   }
//   resolve = (value) => {
//     if (this.status === 'pending') {
//       this.status = 'fulfilled'
//       this.successInfo = value
//     }
//   }
//   reject = (value) => {
//     if (this.status === 'pending') {
//       this.status = 'rejected'
//       this.failInfo = value
//     }
//   }
//   then = (_onSuccess) => {
//     if (this.status === 'fulfilled') {
//       _onSuccess(this.successInfo)
//     }
//   }
//   catch = (_onReject) => {
//     if (this.status === 'rejected') {
//       _onSuccess(this.successInfo)
//     }
//   }
// }

// const promise = new MyPromise((resolve, reject) => {
//   resolve('成功');
// }).then((res) => {
//   console.log(res)
// })


// ----------------------------------------------------------------------


// const mincroTask = []
// const macroTask = []
// class Promise {
//   // promise 中的 callback 是同步任务，会立刻执行
//   constructor(executor) {
//     executor(this.resolve)
//   }
//   // resolve 的作用是来触发 then 的执行，
//   // 但是因为 promise.then() 是微任务，所以不能立刻触发，而是将触发的这个步骤放到了微任务中
//   resolve = (_value) => {
//     // 不能立刻触发
//     // this._onSuccess(_value)
//     // 将其放到微任务队列中，等待事件循环来触发
//     mincroTask.push(() => this._onSuccess(_value))
//   }
//   // 成功的 callback
//   then = (onSuccess) => {
//     this._onSuccess = onSuccess
//   }
// }

// setInterval(() => {
//   const task = macroTask.shift()
//   task && task()
//   mincroTask.forEach(item => item())
//   mincroTask.length = 0
// }, 0)

// console.log('1')
// setTimeout(() => {
//   console.log('2')
// }, 0)
// new Promise((resolve) => {
//   resolve('3')
// }).then(res => console.log(res))
// console.log('4')


// 前置知识 ----------------------------------------------------------------------
// 1. 
// function timeout(ms) {
//   return new Promise((resolve, reject) => {
//     setTimeout(resolve, ms, 'done') // 第三个及以后的参数都会作为第一个参数(函数)的参数传入
//   })
// }

// timeout(100).then(value => {
//   console.log(value)
// })

// 2. 
// const p1 = new Promise(function(resolve, reject) {
//   // ...
// })
// const p2 = new Promise(function(resolve, reject) {
//   // ...
//   // p1 的状态决定了 p2 的状态。如果 p1 的状态是 pending，则 p2 的回调函数就会等待 p1 的状态改变。
//   // 如果 p1 的状态已经是 resolved 或者 rejected, 那么 p2 的回调函数将会立即执行。
//   resolve(p1) // 将 p1 传入。等于: 一个异步操作的结果是返回另一个异步操作
// })

/**
 * eg: 
 * 这里的 p2 中的 setTimeout 会先于 p1 中的 setTimeout 执行，但是由于 p2 中的 resolve 传入的是 p1, 所以 p2 的状态会由 p1 来决定。
 * 当 p2 开始执行的时候 p1 的状态还是 pending, 所以会等待 p1 的执行，当 p1 执行完毕之后，因为抛出了一个 error，所以 p2 的执行也会进入 catch 中。
 */
// const p1 = new Promise((resolve, reject) => {
//   setTimeout(() => reject(new Error('fail')), 3000)
// }) 

// const p2 = new Promise((resolve, reject) => {
//   setTimeout(() => resolve(p1), 1000)
// })

// p2
//   .then(result => console.log(result))
//   .catch(error => console.log(error))

// 3. resolve/rejecet 不会阻止代码的执行，并且其后边的代码会先于其执行。因为立即 resolved 的 Promise 是在本轮事件循环的末尾执行，总是晚于本轮事件循环的同步任务
// new Promise((resolve, reject) => { // 执行结果: 2 1 
//   console.log(2)
//   resolve(1)
// }).then(v => {
//   console.log(v)
// })

/**
 * 4. then 方法返回得到是一个新的 Promise 实例(注意: 不是原来那个 Promise 实例)。因此可以采用链式写法。 
 *    采用链式的 then， 可以指定一组按照次序调用的回调函数。这时，前一个回调函数，有可能返回的还是一个 Promise 对象(即异步操作)，
 *    这时，后一个回调函数，就会等待该 Promise 对象的状态发生变化，才会被调用
 */

// 实现 ----------------------------------------------------------------------
/**
 * 实现流程:
 *  1. 最基本的功能
 *      1. Promise 中传入的回调函数立即执行
 *      2. 有三个状态: pending/resolved/rejected, 
 *         改变状态只能调用 resolve 将 pending 改为 resolved, 或者调用 reject 将 pending 改为 rejected
 *      3. 因为 then 在 promise 的实例上调用，所以 then 是定义在原型上的
 *      4. 状态为 resolved 则调用 then 的第一个回调，状态为 rejected 则调用 then 的第二个回调
 *  2. 增加异步处理逻辑
 *    eg: 
 *      const promise = new Promise((resolve, reject) => {
 *        setTimeout(() => {
 *          console.log('这是两秒之后的执行结果')
 *        }, 2000)
 *      })
 *      promse.then(value => {
 *        console.log(value)
 *      }, reason => {
 *        console.log(reason)
 *      })
 *    现象: 
 *      如上的 eg 不会答应任何结果: 
 *        同步代码立即执行， setTimeout 是异步代码。
 *        then 会立即执行，这个时候 Promise 的状态还是 pending， 不会进行执行任何操作， 
 *        当异步代码执行完毕之后，同步代码已经在其开始执行的时候就已经执行完毕了。 所以这个时候什么都不会打印
 *    实现:
 *      定义缓存，用来存储成功和失败的回调函数。
 *      在 then 中判断 resolvedCallback/rejectedCallback 如果 state 是 pending 状态的话则将其进行缓存
 *      在 resolve/reject 中判断如果有缓存则执行缓存。
 */
function MyPromise(executor) {
  // 状态
  this.state = 'pending'
  // 成功之后的值
  this.value = null
  // 失败的原因
  this.reason = null
  // 存放异步成功的缓存
  this.resolvedCache = null
  // 存放异步失败的缓存
  this.rejectedCache = null

  /**
   * 这里采用箭头函数而不采用函数声明的原因: 是因为 this 指向的问题
   * 函数声明:
   *  function test () {}
   * 如果采用函数声明， this 指向是不固定的， 而采用箭头函数 this 是由外层的普通函数来决定的， 这个是在定义的时候就决定了的。 
   * eg: 
   *   new Promise((resolve, reject) => {
   *     resolve('...')
   *     // 这里调用 reject， 就会导致 reject 函数中的 this 指向 window/global， 而不是 MyPromise。 但是在 reject 函数中需要取到当前函数中的 state， 由于 this 的错误指向也就不会取到正确的值。
   *     reject('...')
   *   })
   */
  // function reject(_reason) {
  const reject = (_reason) => {
    /**
     * promise 只可以从 pending 改变到 rejected/resolved, 如果已经是 rejected/resolved 则无法更改状态
     * eg: 其中一种情况
     *    new Promise((resolve, reject) => {
     *      resolve('...') // 这里先调用 resolve， 下边又调用了 reject， 这个时候如果没有 if (this.state === 'pending') { } 的判断，则还会改变 state， 这个时候就违背了 promise 的原则。
     *      reject('...')
     *    })
     */
    if (this.state === 'pending') {
      // 修改状态
      this.state = 'rejected'
      // 保存失败原因
      this.reason = _reason
      // 执行异步回调
      this.rejectedCache && this.rejectedCache(this.value)
    }
  }
  /**
   * 这里采用箭头函数而不采用函数声明的原因: 是因为 this 指向的问题
   * 函数声明:
   *  function test () {}
   * 如果采用函数声明， this 指向是不固定的， 而采用箭头函数 this 是由外层的普通函数来决定的， 这个是在定义的时候就决定了的。 
   * eg: 
   *   new Promise((resolve, reject) => {
   *     // 这里调用 resolve 就会导致 resolve 函数中的 this 指向 window/global， 而不是 MyPromise。 但是在 resolve 函数中需要取到当前函数中的 state， 由于 this 的错误指向也就不会取到正确的值。
   *     resolve('...')
   *     reject('...')
   *   })
   */
  // function resolve(_value) {
  const resolve = (_value) => {
    /**
     * promise 只可以从 pending 改变到 rejected/resolved, 如果已经是 rejected/resolved 则无法更改状态
     * eg: 其中一种情况
     *    new Promise((resolve, reject) => {
     *      resolve('...') // 这里先调用 resolve， 下边又调用了 reject， 这个时候如果没有 if (this.state === 'pending') { } 的判断，则还会改变 state， 这个时候就违背了 promise 的原则。
     *      reject('...')
     *    })
     */
    if (this.state === 'pending') {
      // 保存状态
      this.state = 'resolved'
      // 保存成功后的值
      this.value = _value
      // 执行异步回调
      this.resolvedCache && this.resolvedCache(this.value)
    }
  }

  // 指向传入的函数， 对应到 promise 中就是立刻执行 Promise 的回调函数。
  executor(resolve, reject)
}

MyPromise.prototype.then = function (resolvedCallback, rejectedCallback) {
  // 成功时触发成功的回调
  if (this.state === 'resolved') {
    resolvedCallback(this.value)
  }
  // 失败时触发失败的回调
  if (this.state === 'rejected') {
    rejectedCallback(this.reason)
  }
  // 状态仍然为 pending 时， promise 中有异步函数
  if (this.state === 'pending') {
    // 将成功的回调缓存起来， 等获取到成功的结果(resolve 函数中)的时候再执行
    this.resolvedCache = resolvedCallback
    // 将失败的回调缓存起来， 等获取到失败的结果(reject 函数中)的时候再执行
    this.rejectedCache = rejectedCallback
  }
}



// 使用 ----------------------------------------------------------------------
// 1. 基本功能
// const promise = new MyPromise((resolve, reject) => {
//   // const promise = new Promise((resolve, reject) => {
//   resolve('resolved')
//   reject('rejected')
// })

// 2. 增加异步
const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    /**
     * 这个时候不会打印任何结果: 
     * 同步代码立即执行， setTimeout 是异步代码。
     * then 会立即执行，这个时候 Promise 的状态还是 pending， 不会进行执行任何操作， 
     * 当异步代码执行完毕之后，同步代码已经在其开始执行的时候就已经执行完毕了。 所以这个时候什么都不会打印
     */
    resolve('这是两秒之后的执行结果')
  }, 2000)
})

promise.then(value => {
  console.log(`resolved => ${value}`)
}, reason => {
  console.log(`rejected => ${reason}`)
})





