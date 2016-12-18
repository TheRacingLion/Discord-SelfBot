/*
  Ban. Bans a user from a guild. Can input a mention, ID or name. Can specify how many days of messages to delete. (Needs "Ban Members" permission)
  "ban @user 3" will ban "user" and delete 3 days of their messages (Will only accept number of days between 1 - 9) (Default is 3)
*/
module.exports = (self, log, helper) => {
  self.registerCommand('ban', (msg, args) => {
    // If no user is specified
    if (!args[0]) return helper.delMsg(msg, 'Need to specify a name, an ID or mention the user.')

    // Find the user and get deleteDays
    let user = helper.findMember(msg, args[0])
    if (!user) return helper.delMsg(msg, 'That is not a valid guild member. Need to specify a name, an ID or mention the user.')
    let deleteDays = /\d{1}/.test(args[1]) ? parseInt(args[1], 10) : 3

    // Ban user
    msg.guild.banMember(user.id, deleteDays)
    .then(() => helper.delMsg(msg, `🔨 - *Dropped the hammer on ${user.username}#${user.discriminator}*`))
    .catch((err) => { log.err(err, 'Ban'); helper.delMsg(msg, 'Could not ban ' + user.username) })
  }, {
    guildOnly: true,
    requirements: {permissions: {'banMembers': true}}
  })
}
