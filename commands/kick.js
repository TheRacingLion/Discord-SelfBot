/*
  Kick. Kicks a user from a guild. Can input a mention or an ID. (Needs "Kick Members" permisssion)
*/
module.exports = (self, log) => {
  self.registerCommand('kick', (msg, args) => {
    if (!args[0]) { msg.edit('Need to specify an ID or mention the user.') } else {
      let user = (/^\d{17,18}/.test(args[0])) ? msg.guild.members.get(args[0]).user : msg.mentions[0]
      if (!user) { msg.edit('That is not a valid guild member. Need to specify an ID or mention the user.') } else {
        self.kickGuildMember(msg.guild.id, user.id)
        .then(() => msg.edit('👌'))
        .catch((err) => { log.err(err, 'Kick'); msg.edit('Could not kick ' + user.username) })
      }
    }
  }, {
    guildOnly: true,
    requirements: {permissions: {'kickMembers': true}}
  })
}
