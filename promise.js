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


const mincroTask = []
const macroTask = []
class Promise {
  // promise 中的 callback 是同步任务，会立刻执行
  constructor(executor) {
    executor(this.resolve)
  }
  // resolve 的作用是来触发 then 的执行，
  // 但是因为 promise.then() 是微任务，所以不能立刻触发，而是将触发的这个步骤放到了微任务中
  resolve = (_value) => {
    // 不能立刻触发
    // this._onSuccess(_value)
    // 将其放到微任务队列中，等待事件循环来触发
    mincroTask.push(() => this._onSuccess(_value))
  }
  // 成功的 callback
  then = (onSuccess) => {
    this._onSuccess = onSuccess
  }
}

setInterval(() => {
  const task = macroTask.shift()
  task && task()
  mincroTask.forEach(item => item())
  mincroTask.length = 0
}, 0)

console.log('1')
setTimeout(() => {
  console.log('2')
}, 0)
new Promise((resolve) => {
  resolve('3')
}).then(res => console.log(res))
console.log('4')