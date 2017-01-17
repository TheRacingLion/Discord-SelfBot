/*
  Ping. Edits the message to "Pong!" to check if the bot is online.
*/
module.exports = (self, log, helper) => {
  self.registerCommand('ping', (msg, args) => {
    msg.delete()
    .then(msg.channel.createMessage('Pong!').then(m => helper.delMsg(m, `${m.content} (${m.timestamp - msg.timestamp}ms)`)))
  })
}
