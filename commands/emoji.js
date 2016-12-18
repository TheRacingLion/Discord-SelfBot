/*
  Emoji. Add emojis from URL's, remove or list emojis from the current guild. (Needs "Manage Emojis" permisssion)
  "emoji add emoji_name IMAGE_URL"
  "emoji remove emoji"
  "emoji list"
*/
const request = require('superagent')

module.exports = (self, log, helper) => {
  self.registerCommand('emoji', (msg, args) => {
    // If no arguments
    if (!args[0]) return helper.delMsg(msg, 'What do you want to do? `add`, `remove`, or `list` emojis.')

    // If the user wants to "add" an emoji
    if (args[0] === 'add') {
      if (!args[1] || !args[2]) return helper.delMsg(msg, 'Specify a name and a image url for the new emoji.')
      request.get(args[2])
      .end((err, res) => {
        // If there is an error getting the emoji
        if (err) { log.err(err, 'Emoji'); return helper.delMsg(msg, 'There was an error.') }
        // If no error
        if (res.body && res.statusCode === 200) {
          const buf = res.body
          const type = buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF ? 'data:image/jpeg;base64,' : 'data:image/png;base64,'
          self.createGuildEmoji(msg.guild.id, { name: args[1], image: `${type}${res.body.toString('base64')}` })
          .then(e => helper.delMsg(msg, `**Guild Emoji created!**\nName: \`:${e.name}:\``))
          .catch(err => { log.err(err, 'Emoji'); helper.delMsg(msg, 'There was an error.') })
        }
      })

    // If the user wants to "remove" a guild emoji
    } else if (args[0] === 'remove') {
      if (!args[1]) return helper.delMsg(msg, 'No emoji specified.')
      if (msg.guild.emojis.length > 0) {
        self.deleteGuildEmoji(msg.guild.id, /<:\w+:(\d+)>/.exec(args[1])[1])
        .then(() => helper.delMsg(msg, `**Guild Emoji Deleted!**\nWas: \`${args[1]}\``))
        .catch(err => { log.err(err, 'Emoji'); helper.delMsg(msg, 'There was an error.') })
      } else return helper.delMsg(msg, 'This guild has no custom Emojis.')

    // If the user wants to "list" all emojis
    } else if (args[0] === 'list') {
      if (msg.guild.emojis.length > 0) {
        msg.edit(`**Emojis:** ${msg.guild.emojis.map(e => `\`:${e.name}:\``).join(', ')}`)
      } else return helper.delMsg(msg, 'This guild has no custom Emojis.')
    }
  }, {
    guildOnly: true,
    requirements: {permissions: {'manageEmojis': true}}
  })
}
