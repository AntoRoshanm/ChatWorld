
// 
// Example:
// 

var wrapper = require('../')

var foo = wrapper(function _foo (options, cb) {
  return cb(null, options)
})

foo.before(function (options, cb, next) {
  console.log('before hook one', arguments)
  next()
})

foo.before(function (options, cb, next) {
  console.log('before hook two', arguments)
  next()
})

foo.after(function (err, result, next) {
  console.log('after hook one', arguments)
  next()
})

foo.after(function (err, result, next) {
  console.log('after hook two', arguments)
  next()
})

foo.finally(function (err, result) {
  console.log('all the after hooks have run', arguments)
})

foo({ s : 1}, function (err, result) {
  if (err) console.log('error!', err)
  console.log('foo!', err, result)
  // return a truthy value to execute after hooks with the same 
  // arguments that this function received, or return a falsy value
  // to skip the after hooks
  return true
})
