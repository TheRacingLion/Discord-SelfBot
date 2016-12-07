/*
  Eval. Evaluates a snippet of javascript code.
*/
const util = require('util')

module.exports = (self, log) => {
  self.registerCommand('eval', (msg, args) => {
    if (msg.author.id !== self.user.id) { return } else {
      msg.delete().then(() => msg.channel.createMessage('Evaluating...').then(m => {
        let evaled = ''
        try {
          evaled = eval(args.join(' ')) // eslint-disable-line no-eval
          if (Array.isArray(evaled) || typeof evaled === 'object') { evaled = util.inspect(evaled) }
        } catch (err) {
          evaled = 'There was an error! Check console.'
          log.err(err, 'Eval')
        }
        m.edit('```xl\n' + clean(evaled) + '\n```')
      }))
    }
    function clean (text) {
      if (typeof (text) === 'string') {
        return text.replace(/`/g, '`' + String.fromCharCode(8203))
      } else { return text }
    }
  })
}
