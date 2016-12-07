/*
  I do not own this tag parser.
  Built by Gus Caplan (https://github.com/GusCaplan/TagScript). Thanks Gus ;)
*/
const Parser = require('expr-eval').Parser

module.exports = {
  'object': (json, selector) => {
    let value = JSON.parse(json)
    for (const prop of selector.split('.')) { value = value[prop] }
    return value
  },
  'join': (joiner, ...args) => args.join(joiner),
  'math': (...args) => Parser.evaluate(args.join('')),
  'choose': (...args) => args[Math.floor(Math.random() * args.length)],
  'range': (min, max) => Math.floor(Math.random() * parseInt(max, 10)) + parseInt(min, 10),
  'randstr': (chars, length) => {
    let result = ''
    for (var i = length; i > 0; --i) { result += chars[Math.floor(Math.random() * chars.length)] }
    return result
  },
  'lower': t => t.toLowerCase(),
  'upper': t => t.toUpperCase(),
  'length': t => t.length,
  'note': '',
  'l': '{',
  'r': '}',
  'semi': ';',
  'fight': '(ง\'̀-\'́)ง'
}
