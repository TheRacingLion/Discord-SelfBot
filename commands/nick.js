/*
  Nick. Edits your nickname in a guild. Leave blank to remove the current nick. (Needs "Change Nickname" permission)
*/
module.exports = (self, log, helper) => {
  self.registerCommand('nick', (msg, args) => {
    self.editNickname(msg.channel.guild.id, args ? args.join(' ') : null).then(() => helper.delMsg(msg, '👌'))
  }, {
    guildOnly: true,
    requirements: {permissions: {'changeNickname': true}}
  })
}
