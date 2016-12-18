/*
  Paste. Copy-paste a meme text into chat. If an array is given it will choose one of its elements randomly.
  Options are: (Add your own in config/paste.json)
  - edgyshit, goodshit, apache, random
*/
const paste = require('../config/paste.json')

module.exports = (self, log, helper) => {
  self.registerCommand('paste', (msg, args) => {
    // If nothing is specified
    if (!args[0]) return helper.delMsg(msg, 'Be more specific..')

    if (Object.keys(paste).includes(args[0].toLowerCase())) {
      let reply = paste[args[0].toLowerCase()]
      msg.delete()
      // Check if the paste chosen is an array
      if (Array.isArray(reply)) {
        msg.channel.createMessage(reply[~~(Math.random() * reply.length)])
      } else msg.channel.createMessage(reply)
    } else return helper.delMsg(msg, 'Not found.')
  })
}
