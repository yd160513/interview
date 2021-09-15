function deepClone(obj) {
  if (!obj || typeof obj !== 'object') return obj
  const result = Array.isArray(obj) ? [] : {}
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      result[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]
    }
  }
  return result
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

const deepCloneRes = deepClone(deepCloneObj)
console.log('deepClone(deepCloneObj) =>', deepCloneRes)
deepCloneRes.a = 123
console.log('deepClone(deepCloneObj) =>', deepCloneRes)
console.log('deepCloneObj =>', deepCloneObj)