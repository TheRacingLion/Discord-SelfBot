/*
  Ping. Edits the message to "Pong!" to check if the bot is online.
*/
module.exports = (self, log) => {
  self.registerCommand('ping', (msg, args) => {
    msg.delete().then(() => msg.channel.createMessage('Pong!').then(m => m.edit(`${m.content} (${m.timestamp - msg.timestamp}ms)`)))
  })
}
