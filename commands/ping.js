/*
  Ping. Edits the message to "Pong!" to check if the bot is online.
*/
module.exports = (self) => {
  self.registerCommand('ping', function (msg, args) {
    this.self.createMessage(msg.channel.id, 'Pong!').then(m => this.edit(m, `${m.content} (${m.timestamp - msg.timestamp}ms)`))
  }, {
    aliases: ['pong']
  })
}
