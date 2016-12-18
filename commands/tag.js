/*
  Tags. Tag parser, cause why not.
*/
const request = require('superagent')
const TagScript = require('../utils/tags/index')
let tag = new TagScript()

module.exports = (self, log, helper) => {
  self.registerCommand('tag', (msg, args) => {
    if (!args[0]) return helper.delMsg(msg, 'Be more specific..')
    const functions = {
      'http': (method, url, body = {}) => {
        return new Promise((resolve, reject) => {
          if (!(method in request)) reject('invalid method')
          request[method](url)
          .send(JSON.parse(`{${body}}`))
          .end((err, res) => {
            if (err) reject(err)
            resolve(res.text)
          })
        })
      }
    }
    tag.highlight(args.join(' ')).then(h => log.log(h, 'Tag Parser'))
    tag.compile(args.join(' '), functions)
    .then(c => { if (!c || c === '') { return } else helper.delMsg(msg, c, 10000) })
    .catch(err => { log.err(err, 'Tag Parser'); helper.delMsg(msg, 'Error. Check console.') })
  })
}
