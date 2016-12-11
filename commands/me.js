/*
  Me. Quote you or someone else with cool discord embeds.
  Quote without author: "me text"
  To quote you: "me user text"
  To quote someone else: "me user @someone text"
*/
module.exports = (self, log) => {
  self.registerCommand('me', (msg, args) => {
    let user = {name: null, avatar: null}
    let msgContent = args.join(' ')
    if (/user/.test(args[0])) {
      if (/<@!?\d{17,18}>/.test(args[1]) && msg.mentions[0]) {
        user.name = `${msg.mentions[0].username}#${msg.mentions[0].discriminator}`
        user.avatar = msg.mentions[0].avatarURL
        msgContent = msgContent.replace(`user <@${msg.mentions[0].id}>`, '')
      } else {
        user.name = `${msg.author.username}#${msg.author.discriminator}`
        user.avatar = msg.author.avatarURL
        msgContent = msgContent.replace('user ', '')
      }
    }
    msg.delete().then(() => msg.channel.createMessage({embed: {
      author: { name: user.name, icon_url: user.avatar },
      description: msgContent
    }}))
  })
}
