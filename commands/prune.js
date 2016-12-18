/*
  Prune. Deletes messages sent by you from a channel. Need to specify a number of messages to delete.
*/
module.exports = (self, log, helper) => {
  self.registerCommand('prune', (msg, args) => {
    if (!args[0] || !/\d{1,2}/ig.test(args[0])) return helper.delMsg(msg, 'Please specify the number of messages to delete.')
    msg.channel.getMessages(200).then(msgs => {
      let msgArray = msgs.filter(m => m.author.id === self.user.id)
      msgArray.length = parseInt(args[0], 10) + 1
      msgArray.map(m => m.delete().catch(err => log.err(err)))
    })
  })
}
