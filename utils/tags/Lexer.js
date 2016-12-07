/*
  I do not own this tag parser.
  Built by Gus Caplan (https://github.com/GusCaplan/TagScript). Thanks Gus ;)
*/
const chevrotain = require('chevrotain')

if (!Object.values) {
  const reduce = Function.bind.call(Function.call, Array.prototype.reduce)
  const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable)
  const concat = Function.bind.call(Function.call, Array.prototype.concat)
  const keys = Reflect.ownKeys
  Object.values = function values (O) {
    return reduce(keys(O), (v, k) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []), [])
  }
}

Object.defineProperty(Array.prototype, 'last', { // eslint-disable-line
  get () {
    return this[this.length - 1]
  }
})

const Lexer = chevrotain.Lexer

module.exports = (input, allTokens, highlight) => {
  return new Promise((resolve, reject) => {
    const SelectLexer = new Lexer(Object.values(allTokens), true)

    const tokenize = text => {
      var lexResult = SelectLexer.tokenize(text)

      if (lexResult.errors.length >= 1) {
        reject(lexResult.errors[0].message + ' ' + lexResult.errors[0].stack)
      }
      return lexResult
    }

    let lexed = tokenize(input)
    let tokens = lexed.tokens

    let scope = []
    let run = []
    let lastEX = 0

    const prepare = (scoped, ex, called = false) => {
      delete scoped.next
      let out = scoped
      run.push({ex: ex, run: out, called: called, compiled: null})
    }

    const prepareBare = image => {
      run.push({ex: lastEX++, run: {'function': null, args: []}, compiled: image})
      scope.splice(scope.length - 1, 1)
    }

    const scopeTemplate = next => {
      return {'function': null, next: next, args: []}
    }

    tokens.forEach(token => {
      switch (token.constructor.name) {
        case 'FunctionOpen':
          if (!scope.last) scope.push(scopeTemplate)
          switch (scope.last.next) {
            case 'args':
              scope.last.args.push(`EX_${lastEX}`)
              scope.push(scopeTemplate('function'))
              break
            default:
              scope.push(scopeTemplate('function'))
              break
          }
          break
        case 'FunctionClose':
          prepare(scope.last, lastEX++, (scope.length > 2))
          scope.splice(scope.length - 1, 1)
          break
        case 'ArgumentSeperator':
          break
        case 'Identifier':
          if (!scope.last) {
            return prepareBare(token.image)
          }
          switch (scope.last.next) {
            case 'function':
              scope.last.function = token.image
              scope.last.next = 'args'
              break
            case 'args':
              scope.last.args.push(token.image)
              break
            default:
              prepareBare(token.image)
              break
          }
          break
        default:
          break
      }
    })
    resolve({
      run: run,
      raw: tokens
    })
  })
}
