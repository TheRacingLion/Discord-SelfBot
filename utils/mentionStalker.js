/*
  Created by TheRacingLion (https://github.com/TheRacingLion) [ 6 / 12 / 2016 ]
  -*Read LICENSE to know more about permissions*-

  Mention Stalker. Tracks users that mentioned you and notifies it in the notification channel or in console.
*/
const moment = require('moment')

module.exports = (self, log, config) => {
  self.on('messageCreate', (msg) => {
    if (msg.author.id !== self.user.id && msg.channel.guild && ~msg.content.indexOf(self.user.id)) {
      if (config.mentionNotificator.inConsole) { log.mention(msg) }
      if (config.mentionNotificator.inNotificationChannel) {
        if (Object.keys(self.channelGuildMap).includes(config.notificationChannelID)) {
          self.createChannelWebhook(config.notificationChannelID, { name: msg.author.username }).then(w => {
            self.executeWebhook(w.id, w.token, {
              username: msg.author.username,
              avatarURL: msg.author.avatarURL,
              content: `**I mentioned you in** ${msg.channel.mention}!`,
              embeds: [{
                title: moment(msg.timestamp).format('ddd, Do of MMM @ HH:mm:ss'),
                description: `${msg.content}`,
                color: 16426522,
                author: { name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`, icon_url: msg.author.avatarURL },
                fields: [
                  { name: 'Guild', value: `${msg.channel.guild.name}\n(${msg.channel.guild.id})`, inline: true },
                  { name: 'Channel', value: `#${msg.channel.name}\n(${msg.channel.id})`, inline: true },
                  { name: 'Msg', value: `(${msg.id})`, inline: true }
                ]
              }]
            }).then(self.deleteWebhook(w.id, w.token))
          })
        } else { log.err('Invalid config, "notificationChannelID". Must be a channel ID from a server you are in.', 'Mention Stalker'); process.exit() }
      }
    } else return
  })
}
