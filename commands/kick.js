/*
  Kick. Kicks a user from a guild. Can input a mention, ID or name. (Needs "Kick Members" permisssion)
*/
module.exports = (self, log, helper) => {
  self.registerCommand('kick', (msg, args) => {
    // If no user is specified
    if (!args[0]) return helper.delMsg(msg, 'Need to specify a name, an ID or mention the user.')

    // Find the user
    let user = helper.findMember(msg, args[0])
    if (!user) return helper.delMsg(msg, 'That is not a valid guild member. Need to specify a name, an ID or mention the user.')

    // Kick user
    msg.guild.kickMember(user.id)
    .then(() => helper.delMsg(msg, '👌'))
    .catch((err) => { log.err(err, 'Kick'); helper.delMsg(msg, 'Could not kick ' + user.username) })
  }, {
    guildOnly: true,
    requirements: {permissions: {'kickMembers': true}}
  })
}
