/*
  Ping. Edits the message to "Pong!" to check if the bot is online.
*/
module.exports = (self) => {
  self.registerCommand('ping', function (msg, args) {
    this.send(msg, 'Pong!')
  }, {
    aliases: ['pong']
  })
}
