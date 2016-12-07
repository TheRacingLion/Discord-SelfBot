/*
  I do not own this tag parser.
  Built by Gus Caplan (https://github.com/GusCaplan/TagScript). Thanks Gus ;)
*/
const ohsync = require('asyncawait/async')
const ohwait = require('asyncawait/await')

module.exports = (run, functions = {}) => {
  let runtimeArgs = {}
  const internal = {
    'get': i => runtimeArgs[i],
    'set': (i, x) => {
      runtimeArgs[i] = x
      return
    }
  }
  const builtin = Object.assign(require('./builtin.js'), internal)

  Object.keys(builtin).forEach(k => {
    if (Object.keys(functions).includes(k)) throw new Error(`"${k}" is a reserved function name`)
  })

  functions = Object.assign(functions, builtin)

  return (ohsync(() => {
    run.forEach(i => {
      if (i.run.function === null) return
      i.run.args = i.run.args.map(arg => {
        if (run.find(r => ('EX_' + r.ex) === arg)) {
          let replacement = run.find(r => 'EX_' + r.ex === arg).compiled
          return replacement
        } else {
          return arg
        }
      })
      if (!(i.run.function in functions)) {
        i.compiled = ''
        return
      }
      let compiled = functions[i.run.function]
      if (typeof compiled === 'string') {
        i.compiled = compiled
      } else if (typeof compiled === 'object') {
        i.compiled = JSON.stringify(compiled)
      } else {
        compiled = compiled(...i.run.args)
        if (compiled instanceof Promise) {
          try {
            i.compiled = ohwait(compiled)
          } catch (err) {
            i.compiled = ''
          }
        } else {
          i.compiled = compiled
        }
      }
    })
    let compiled = run.filter(e => !e.called).map(e => e.compiled).join('').trim()
    return compiled
  })())
}
