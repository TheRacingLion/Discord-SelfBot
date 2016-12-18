/*
  Created by TheRacingLion (https://github.com/TheRacingLion) [ 18 / 12 / 2016 ]
  -*Read LICENSE to know more about permissions*-

  Helpers file. Different funtions that help with bot tasks.
*/
const config = require('../config/config.json')

module.exports = {
  delMsg (msg, text, delay = 4000) {
    if (config.deleteCommandMessages) {
      msg.edit(text).then(m => setTimeout(() => m.delete(), delay))
    } else msg.edit(text)
  },
  findMember (msg, str) {
    if (/^\d{17,18}/.test(str) || /^<@!?\d{17,18}>/.test(str)) {
      const member = msg.guild.members.get(/^<@!?\d{17,18}>/.test(str) ? str.replace(/<@!?/, '').replace('>', '') : str)
      if (!member) { return false } else { return member.user }
    } else if (/.{1,33}/.test(str)) {
      const isMemberName = (name, str) => name === str || name.startsWith(str) || name.includes(str)
      const member = msg.guild.members.find(m => {
        if (m.nick && isMemberName(m.nick.toLowerCase(), str.toLowerCase())) return true
        return isMemberName(m.user.username.toLowerCase(), str.toLowerCase())
      })
      if (!member) { return false } else { return member.user }
    } else return false
  },
  createMeEmbed (msg, args) {
    let user = {name: null, avatar: null, id: false}
    if (/user/.test(args[0])) {
      let isUser = this.findMember(msg, args[1])
      if (isUser) {
        user = {name: `${isUser.username}#${isUser.discriminator}`, avatar: isUser.avatarURL, id: isUser.id}
        args.splice(0, 2)
      } else {
        user = {name: `${msg.author.username}#${msg.author.discriminator}`, avatar: msg.author.avatarURL, id: msg.author.id}
        args.splice(0, 1)
      }
    }
    let indexOfColor = args.indexOf(args.find(s => /color=.+/ig.test(s)))
    let defaultColor = parseInt(config.defaultEmbedColor.replace('#', ''), 16)
    let color = ~indexOfColor ? args[indexOfColor] : defaultColor
    if (color !== defaultColor) {
      args.splice(indexOfColor, 1)
      color = color.replace(/color=/i, '')
      if (color.toLowerCase() === 'random') {
        const keys = Object.keys(colors)
        let random = colors[ keys[ keys.length * Math.random() << 0 ] ]
        color = parseInt(random.replace('#', ''), 16)
      } else if (color.toLowerCase() === 'role' && user.id) {
        let rolePositions = msg.guild.members.get(user.id).roles.map(r => msg.guild.roles.get(r).position)
        let toprole = rolePositions.indexOf(Math.max.apply(Math, rolePositions))
        color = msg.guild.members.get(user.id).roles.map(r => msg.guild.roles.get(r).color)[toprole]
      } else if (Object.keys(colors).includes(color.toLowerCase())) {
        color = parseInt(colors[color].replace('#', ''), 16)
      } else if (/#?([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/i.test(color)) {
        color = parseInt(color.replace('#', ''), 16)
      } else color = defaultColor
    }
    return {
      author: { name: user.name, icon_url: user.avatar },
      description: args.join(' '),
      color: color
    }
  }
}

const colors = {
  black:  '#000000',
  teal:   '#008080',
  lime:   '#00FF00',
  aqua:   '#00FFFF',
  green:  '#1f8b4c',
  cyan:   '#00FFFF',
  purple: '#800080',
  grey:   '#808080',
  blue:   '#87CEEB',
  violet: '#EE82EE',
  red:    '#FF0000',
  orange: '#FFA500',
  pink:   '#FFB6C1',
  gold:   '#FFD700',
  yellow: '#FFFFE0',
  white:  '#FFFFFF'
}
