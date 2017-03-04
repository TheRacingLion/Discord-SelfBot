/*
  Nick. Edits your nickname in a guild. Leave blank to remove the current nick. (Needs "Change Nickname" permission)
*/
module.exports = (self) => {
  self.registerCommand('nick', function (msg, args) {
    this.self.editNickname(msg.channel.guild.id, args ? args.join(' ') : null).then(() => this.send(msg, '👌'))
  }, {
    perms: ['changeNickname'],
    noPms: true
  })
}
