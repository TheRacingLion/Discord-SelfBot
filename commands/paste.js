/*
  Paste. Copy-paste a meme text into chat. If an array is given it will choose one of its elements randomly.
  Options are: (Add your own in config/paste.json)
  - edgyshit, goodshit, apache, random
*/
const paste = require('../config/paste.json')

module.exports = (self) => {
  self.registerCommand('paste', function (msg, args) {
    // If nothing is specified
    if (!args[0]) return this.send(msg, 'Be more specific..')

    if (Object.keys(paste).includes(args[0].toLowerCase())) {
      let reply = paste[args[0].toLowerCase()]
      // Check if the paste chosen is an array
      if (Array.isArray(reply)) {
        reply = reply[~~(Math.random() * reply.length)]
      }
      this.self.createMessage(msg.channel.id, reply)
    } else return this.send(msg, 'Not found.')
  })
}
