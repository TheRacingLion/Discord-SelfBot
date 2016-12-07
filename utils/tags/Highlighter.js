/*
  I do not own this tag parser.
  Built by Gus Caplan (https://github.com/GusCaplan/TagScript). Thanks Gus ;)
*/
const chalk = require('chalk')

module.exports = (tokens) => {
  let highlighted = ''
  let scope = []

  const prepare = (scoped, ex, called = false) => {
    delete scoped.next
  }

  const prepareBare = image => {
    scope.splice(scope.length - 1, 1)
  }

  const scopeTemplate = next => {
    return {'function': null, next: next, args: []}
  }

  return new Promise((resolve, reject) => {
    tokens.forEach(token => {
      switch (token.constructor.name) {
        case 'FunctionOpen':
          if (!scope.last) scope.push(scopeTemplate)
          highlighted += chalk.blue(token.image)
          switch (scope.last.next) {
            case 'args':
              scope.push(scopeTemplate('function'))
              break
            default:
              scope.push(scopeTemplate('function'))
              break
          }
          break
        case 'FunctionClose':
          highlighted += chalk.blue(token.image)
          prepare(scope.last, 0, (scope.length > 2))
          scope.splice(scope.length - 1, 1)
          break
        case 'ArgumentSeperator':
          highlighted += chalk.yellow(token.image)
          break
        case 'Identifier':
          if (!scope.last) {
            highlighted += chalk.white(token.image)
            return prepareBare(token.image)
          }
          switch (scope.last.next) {
            case 'function':
              highlighted += chalk.red(token.image)
              scope.last.function = token.image
              scope.last.next = 'args'
              break
            case 'args':
              highlighted += chalk.green(token.image)
              scope.last.args.push(token.image)
              break
            default:
              highlighted += chalk.white(token.image)
              prepareBare(token.image)
              break
          }
          break
        default:
          break
      }
    })
    resolve(highlighted)
  })
}
