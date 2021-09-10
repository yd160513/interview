async function async1() {
  console.log('async1 start') // 2
  await async2()
  // await 的后边，都可以看成是 callback 里边的内容，即异步
  // 类似于 event loop, setTimeout(cb)
  // 类似于将 await 后边的内容封装到了 Promise.resolve().then(cb) 中、setTimeout(cb) 中
  console.log('async1 end') // 5
  await async3()
  console.log('async1 end 2') // 7
}

async function async2() {
  console.log('async2') // 3
}

async function async3() {
  console.log('async3') // 6
}

console.log('script start') // 1
async1()
console.log('script end') // 4

// ------------------------------------------------------------------------------------------
async function fn() {
  return 100
}

(async function () {
  const a = fn() // ? => pending 状态的 promise 对应值为 100
  console.log('a', a)
  const b = await fn() // ? => 100
  console.log('b', b)
})()

// ------------------------------------------------------------------------------------------
(async function() {
  console.log('start')
  const a = await 100
  console.log('a', a)
  const b = await Promise.resolve(200)
  console.log('b', b)
  const c = await Promise.reject(300)
  console.log('c', c)
  console.log('end')
})() // 执行完毕，打印出哪些内容？ => start 100 200 报错

// ------------------------------------------------------------------------------------------
async function async1() {
  console.log('async1 start') // 2
  await async2() // resolve(Promise.resolve())
  console.log('async1 end') // 7
}

async function async2() {
  console.log('async2') // 3
}

console.log('script start') // 1

setTimeout(function () {
  console.log('setTimeout') // 8
}, 0)

async1()

new Promise(function (resolve) {
  console.log('promise1') // 4
  resolve()
}).then(function () {
  console.log('promise2') // 6
})

console.log('script end') // 5
// 直接完毕，打印结果: 
//    我给的答案: 'script start' 'async1 start' async2 promise1 'script end' 'async1 end' promise2 setTimeout (错在了 async1 end 和 promise2 的顺序)
//    正确答案: 'script start' 'async1 start' async2 promise1 'script end' promise2 'async1 end' setTimeout

// ------------------------------------------------------------------------------------------
console.log('script start') // 1

async function async1() {
  await async2()
  console.log('async1 end') // 7
}
async function async2() {
  console.log('async2 end') // 2
}
async1()

setTimeout(function() {
  console.log('setTimeout') // 8
}, 0)

new Promise(resolve => {
  console.log('Promise') // 3
  resolve()
})
  .then(function() {
    console.log('promise1') // 5
  })
  .then(function() {
    console.log('promise2') // 6
  })

console.log('script end') // 4