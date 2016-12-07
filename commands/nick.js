/*
  Nick. Edits your nickname in a guild. Leave blank to remove the current nick. (Needs "Change Nickname" permission)
*/
module.exports = (self, log) => {
  self.registerCommand('nick', (msg, args) => {
    msg.edit('👌').then(m => self.editNickname(msg.guild.id, args ? args.join(' ') : null))
  }, {
    guildOnly: true,
    requirements: {permissions: {'changeNickname': true}}
  })
}
