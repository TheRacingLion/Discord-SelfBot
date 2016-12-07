/*
  Ban. Bans a user from a guild. Can input a mention or an ID. Can specify how many days of messages to delete.
  "ban @user 3" will ban "user" and delete 3 days of their messages (Will only accept number of days between 1 - 9) (Default is 3)
*/
module.exports = (self, log) => {
  self.registerCommand('ban', (msg, args) => {
    if (!args[0]) { msg.edit('Need to specify an ID or mention the user.') } else {
      let user = (/^\d{17,18}/.test(args[0])) ? msg.guild.members.get(args[0]).user : msg.mentions[0]
      if (!user) { msg.edit('That is not a valid guild member. Need to specify an ID or mention the user.') } else {
        let deleteDays = (/\d{1}/.test(args[1])) ? args[1] : 3
        msg.guild.banMember(user.id, deleteDays)
        .then(() => msg.edit(`🔨 - *Dropped the hammer on ${user.username}#${user.discriminator}*`))
        .catch((err) => { log.err(err, 'Ban'); msg.edit('Could not ban ' + user.username) })
      }
    }
  }, {
    guildOnly: true,
    requirements: {permissions: {'banMembers': true}}
  })
}
