/*
  Created by TheRacingLion (https://github.com/TheRacingLion) [ 03 / 03 / 2017 ]
  -*Read LICENSE to know more about permissions*-

  Command class. Everything that is needed to build a command on this selfbot.
*/
const Logger = require('./plugins/Logger.js')

class Command {
  constructor (self, name, generator, options) {
    this.self = self
    this.constants = self.constants
    this.config = self.config
    this.log = Logger
    this.defaultColor = parseInt(this.config.defaultEmbedColor.replace('#', ''), 16)

    this.name = name || ''
    this.aliases = options.aliases || []
    this.perms = options.perms || []
    this.deleteAfter = options.deleteAfter || this.config.deleteCommandMessages
    this.noPms = !!options.noPms

    if (typeof generator === 'function') {
      this.run = generator.bind(this)
    } else {
      throw new Error('Invalid command function')
    }
  }

  process (msg, args) {
    // Check if owner is the author
    if (msg.author.id !== this.self.user.id) return
    // Check if msg is private
    if (!msg.channel.guild && this.noPMs === true) {
      this.send(msg, 'This command is disabled in PMs!', 5000)
      return
    }
    // Check if author has the required permissions
    if (this.perms.length > 0) {
      if (!msg.channel.guild) {
        this.send(msg, 'This is a server only command!', 5000)
        return
      }
      const authorPerms = msg.channel.permissionsOf(msg.author.id).json
      for (let perm in this.perms) {
        if (!authorPerms[this.perms[perm]]) {
          this.send(msg, `Missing permissions. (${this.perms[perm]})`, 5000)
          return
        }
      }
    }
    // Run command
    try {
      this.run(msg, args)
    } catch (err) {
      this.log.err(err, `${this.name.toUpperCase()} on run`)
      this.send(msg, 'Something bad happened.', 5000)
      return
    }
  }

  send (msg, content, deleteDelay = 0) {
    deleteDelay = deleteDelay || this.config.deleteCommandMessagesTime
    if (content.length > 20000) {
      this.log.err('Error sending a message larger than the limit (2000+)')
      return
    }
    return new Promise((resolve, reject) => {
      this.self.createMessage(msg.channel.id, content)
      .then(msg => {
        this.self.counts.msgsSent = this.self.counts.msgsSent + 1
        if (deleteDelay) {
          if (this.deleteAfter) return resolve(msg)
          setTimeout(() => {
            this.self.deleteMessage(msg.channel.id, msg.id)
            .then(() => { resolve(msg) }).catch(reject)
          }, deleteDelay)
        }
        return resolve(msg)
      })
      .catch(reject)
    })
  }

  embed (msg, embed = {}, deleteDelay = 0) {
    deleteDelay = deleteDelay || this.config.deleteCommandMessagesTime
    if (!embed.color) embed.color = this.defaultColor
    return new Promise((resolve, reject) => {
      this.self.createMessage(msg.channel.id, { content: '', embed: embed })
      .then(msg => {
        this.self.counts.msgsSent = this.self.counts.msgsSent + 1
        if (deleteDelay) {
          if (this.deleteAfter) return resolve(msg)
          setTimeout(() => {
            this.self.deleteMessage(msg.channel.id, msg.id)
            .then(() => { resolve(msg) }).catch(reject)
          }, deleteDelay)
        }
        return resolve(msg)
      })
      .catch(reject)
    })
  }

  edit (msg, content, deleteDelay = 0) {
    deleteDelay = deleteDelay || this.config.deleteCommandMessagesTime
    if (content.length > 20000) {
      this.log.err('Error sending a message larger than the limit (2000+)')
      return
    }
    return new Promise((resolve, reject) => {
      this.self.editMessage(msg.channel.id, msg.id, content)
      .then(m => {
        if (deleteDelay) {
          if (this.deleteAfter) return resolve(m)
          setTimeout(() => {
            this.self.deleteMessage(m.channel.id, m.id)
            .then(() => { resolve(m) }).catch(reject)
          }, deleteDelay)
        }
        return resolve(m)
      })
      .catch(reject)
    })
  }

  findMember (msg, str) {
    if (!str || str === '') return false
    const guild = msg.channel.guild
    if (!guild) return msg.mentions[0] ? msg.mentions[0] : false
    if (/^\d{17,18}/.test(str) || /^<@!?\d{17,18}>/.test(str)) {
      const member = guild.members.get(/^<@!?\d{17,18}>/.test(str) ? str.replace(/<@!?/, '').replace('>', '') : str)
      return member ? member.user : false
    } else if (str.length <= 33) {
      const isMemberName = (name, str) => name === str || name.startsWith(str) || name.includes(str)
      const member = guild.members.find(m => {
        if (m.nick && isMemberName(m.nick.toLowerCase(), str.toLowerCase())) return true
        return isMemberName(m.user.username.toLowerCase(), str.toLowerCase())
      })
      return member ? member.user : false
    } else return false
  }

  getColor (color, msg = {}, user = {}) {
    if (!color) return this.defaultColor
    const colors = this.constants.colors

    // color=random
    if (color.toLowerCase() === 'random') {
      const keys = Object.keys(colors)
      let random = colors[ keys[ keys.length * Math.random() << 0 ] ]
      return parseInt(random.replace('#', ''), 16)

    // color=role
    } else if (color.toLowerCase() === 'role' && user.id && msg.channel.guild) {
      const userRoles = msg.channel.guild.members.get(user.id).roles.map(r => msg.channel.guild.roles.get(r)).filter(r => r.color !== 0)
      const rolePositions = userRoles.map(r => r.position)
      const toprole = rolePositions.indexOf(Math.max.apply(Math, rolePositions))
      return userRoles.map(r => r.color)[toprole]

    // color=BASIC_COLOR_NAME
    } else if (Object.keys(colors).includes(color.toLowerCase())) {
      return parseInt(colors[color].replace('#', ''), 16)

    // color=#2a3g4h
    } else if (/#?([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/i.test(color)) {
      return parseInt(color.replace('#', ''), 16)

    // Default
    } else return this.defaultColor
  }
}

module.exports = Command
