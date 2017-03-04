/*
  Kick. Kicks a user from a guild. Can input a mention, ID or name. (Needs "Kick Members" permisssion)
*/
module.exports = (self) => {
  self.registerCommand('kick', function (msg, args) {
    // If no user is specified
    if (!args[0]) return this.send(msg, 'Need to specify a name, an ID or mention the user.')

    // Find the user
    let user = this.findMember(msg, args[0])
    if (!user) return this.send(msg, 'That is not a valid guild member. Need to specify a name, an ID or mention the user.')

    // Kick user
    msg.channel.guild.kickMember(user.id)
    .then(() => this.send(msg, '👌'))
    .catch((err) => { this.log.err(err, 'Kick'); this.send(msg, `Could not kick ${user.username}`) })
  }, {
    perms: ['kickMembers'],
    noPms: true
  })
}
