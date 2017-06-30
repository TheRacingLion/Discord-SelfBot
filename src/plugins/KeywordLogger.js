/*
  Created by TheRacingLion (https://github.com/TheRacingLion) [ 14 / 03 / 2017 ]
  -*Read LICENSE to know more about permissions*-

  Keyword Notifier. Tracks specific keywords set in config and notifies them in the notification channel or in console.
*/
const moment = require('moment')
const keywords = require('../../config/keywords.json')

module.exports = (self, log, config) => {
  self.on('messageCreate', (msg) => {
    if (!msg.author || !msg.channel.guild) return
    if (~config.keywordNotificator.ignoredServers.indexOf(msg.channel.guild.id)) return
    if (msg.author.id !== self.user.id && !msg.author.bot && keywords && keywords.length > 0) {
      for (let i = 0; i < keywords.length; i++) {
        let keyword = config.keywordNotificator.caseInsensitive ? ~msg.cleanContent.replace(/\n/g, ' ').toLowerCase().indexOf(keywords[i].toLowerCase()) : ~msg.content.indexOf(keywords[i])
        if (keyword) {
          self.counts.keywordsGot = self.counts.keywordsGot + 1
          if (!config.keywordNotificator.logBlockedUsers && self.relationships.has(msg.author.id)) {
            if (self.relationships.get(msg.author.id).type === 2) continue
          }
          if (config.keywordNotificator.inConsole) { log.keyword(msg, keywords[i]) }
          if (config.keywordNotificator.inNotificationChannel) {
            if (Object.keys(self.channelGuildMap).includes(config.notificationChannelID)) {
              self.getMessages(msg.channel.id, 4, msg.id).then(msgs => {
                const webhookContent = {
                  username: msg.author.username,
                  avatarURL: msg.author.avatarURL,
                  content: `**I mentioned keyword \`${keywords[i]}\` in** ${msg.channel.mention}!`,
                  embeds: [{
                    title: moment(msg.timestamp).format('ddd, Do of MMM @ HH:mm:ss'),
                    author: {
                      name: `${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`,
                      icon_url: msg.author.avatarURL
                    },
                    color: 16426522,
                    fields: [
                      { name: msgs[2].author.username, value: msgs[2].cleanContent, inline: false },
                      { name: msgs[1].author.username, value: msgs[1].cleanContent, inline: false },
                      { name: msgs[0].author.username, value: msgs[0].cleanContent, inline: false },
                      { name: msg.author.username, value: msg.cleanContent, inline: false },
                      { name: 'Guild', value: `${msg.channel.guild.name}\n(${msg.channel.guild.id})`, inline: true },
                      { name: 'Channel', value: `#${msg.channel.name}\n(${msg.channel.id})`, inline: true },
                      { name: 'Msg', value: `(${msg.id})`, inline: true }
                    ]
                  }]
                }
                self.getChannelWebhooks(config.notificationChannelID).then(webhooks => {
                  if (!webhooks || !webhooks.length) {
                    self.createChannelWebhook(config.notificationChannelID, { name: 'Selfbot' }).then(w => {
                      self.counts.msgsSent = self.counts.msgsSent + 1
                      self.executeWebhook(w.id, w.token, webhookContent)
                    })
                  } else {
                    self.counts.msgsSent = self.counts.msgsSent + 1
                    self.executeWebhook(webhooks[0].id, webhooks[0].token, webhookContent)
                  }
                })
              })
            } else { log.err('Invalid config, "notificationChannelID". Must be a channel ID from a server you are in.', 'Mention Stalker'); process.exit() }
          }
          return
        }
        continue
      }
      return
    }
    return
  })
}
