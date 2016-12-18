/*
  Eval. Evaluates a snippet of javascript code.
*/
const util = require('util')

module.exports = (self, log, helper) => {
  self.registerCommand('eval', (msg, args) => {
    // If msg author is not us
    if (msg.author.id !== self.user.id) return

    // Delete the msg, create a new one, and then eval
    msg.delete().then(() => msg.channel.createMessage('Evaluating...').then(m => {
      let evaled = ''
      try {
        evaled = eval(args.join(' ')) // eslint-disable-line no-eval
        if (Array.isArray(evaled) || typeof evaled === 'object') { evaled = util.inspect(evaled) }
      } catch (err) {
        log.err(err, 'Eval')
        return helper.delMsg(msg, 'There was an error! Check console.')
      }
      helper.delMsg(m, [
        'Input:',
        '```js\n',
        args.join(' '),
        '```\nOutput:',
        '```js\n',
        typeof (evaled) === 'string' ? evaled.replace(/`/g, '`' + String.fromCharCode(8203)) : evaled,
        '\n```'
      ].join(' '), 20000)
    }))
  })
}
