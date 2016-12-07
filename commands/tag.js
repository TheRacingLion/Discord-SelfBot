/*
  Tags. Tag parser, cause why not.
*/
const request = require('superagent')
const TagScript = require('../utils/tags/index')
let tag = new TagScript()

module.exports = (self, log) => {
  self.registerCommand('tag', (msg, args) => {
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
    if (!args[0]) { msg.edit('Be more specific..') } else {
      tag.highlight(args.join(' ')).then(h => log.log(h, 'Tag Parser'))
      tag.compile(args.join(' '), functions)
      .then(c => { if (!c || c === '') { return } else msg.edit(c) })
      .catch(err => { log.err(err, 'Tag Parser'); msg.edit('Error. Check console.') })
    }
  })
}
