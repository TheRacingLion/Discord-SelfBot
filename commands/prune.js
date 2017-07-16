/*
  Prune. Deletes messages sent by you from a channel. Need to specify a number of messages to delete.
*/
module.exports = (self) => {
  self.registerCommand('prune', function (msg, args) {
    // If no number is given
    if (!args[0] || !/\d{1,2}/ig.test(args[0])) return this.send(msg, 'Please specify the number of messages to delete.')

    // Prune msgs
    msg.channel.getMessages(200).then(msgs => {
      let msgArray = msgs.filter(m => m.author.id === this.self.user.id).filter(m => m !== msgs[0])
      msgArray.length = parseInt(args[0], 10)
      msgArray.map(m => m.delete().catch(err => this.log.err(err)))
    })
  })
}
