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
 * 1. Promise 中传入的回调函数立即执行
 * 2. 有三个状态: pending/resolved/rejected, 
 *    改变状态只能调用 resolve 将 pending 改为 resolved, 或者调用 reject 将 pending 改为 rejected
 * 3. 因为 then 在 promise 的实例上调用，所以 then 是定义在原型上的
 * 4. 状态为 resolved 则调用 then 的第一个回调，状态为 rejected 则调用 then 的第二个回调
 */
function MyPromise(executor) {
  this.state = 'pending'
  this.value = null
  this.reason = null

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
      this.state = 'rejected'
      this.reason = _reason
    }
  }

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
      this.state = 'resolved'
      this.value = _value
    }
  }

  executor(resolve, reject)
}

MyPromise.prototype.then = function (resolvedCallback, rejectedCallback) {
  if (this.state === 'resolved') {
    resolvedCallback(this.value)
  }
  if (this.state === 'rejected') {
    rejectedCallback(this.reason)
  }
}



// 使用 ----------------------------------------------------------------------
const promise = new MyPromise((resolve, reject) => {
  // const promise = new Promise((resolve, reject) => {
  resolve('resolved')
  reject('rejected')
})

promise.then(value => {
  console.log(`resolved => ${value}`)
}, reason => {
  console.log(`rejected => ${reason}`)
})
