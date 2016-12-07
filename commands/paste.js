/*
  Paste. Copy-paste a meme text into chat. Options are: (Add your own in config/paste.json)
  - edgyshit, goodshit, apache
*/
const paste = require('../config/paste.json')

module.exports = (self, log) => {
  self.registerCommand('paste', (msg, args) => {
    if (!args[0]) { msg.edit('Be more specific..') } else {
      if (Object.keys(paste).includes(args[0].toLowerCase())) { msg.edit(paste[args[0].toLowerCase()]) } else { msg.edit('Not found.') }
    }
  })
}
