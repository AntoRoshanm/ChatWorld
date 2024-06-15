var slice = Array.prototype.slice

module.exports = function (fn) {

  var wrapper = function (/* arg1, arg2, argn */) {
    var that = this
      , args = slice.call(arguments)
      , cb

    wrapper.do('before', args, then)
    function then () {
      cb = args[args.length-1]
      args[args.length-1] = function () {
        if (cb.apply(this, arguments)) {
          wrapper.do('after', slice.call(arguments), wrapper.wrap.finally)
        } 
      }
      return fn.apply(that, args)
    }
  }

  wrapper.wrap = { before : [], after : [] }

  wrapper.before = function (func) { 
    wrapper.wrap.before.push(func)
  }

  wrapper.after = function (func) { 
    wrapper.wrap.after.push(func)
  }

  wrapper.finally = function (func) { 
    wrapper.wrap.finally = func
  }

  wrapper.do = function (type, args, cb) {
    var that = this
      , wraps = wrapper.wrap[type]
      , i = -wraps.length

    if (wraps.length) {
      args.push(function next () {
        i++
        if (i < 0) return wraps[i + wraps.length].apply(that, args)
        else {
          args.pop()
          return cb && cb.apply(that, args)
        }
      })
      return wraps[i + wraps.length].apply(this, args)
    }
    else return cb && cb.apply(this, args)
  }

  return wrapper
}
