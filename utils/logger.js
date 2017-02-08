/*
  Created by TheRacingLion (https://github.com/TheRacingLion) [ 18 / 12 / 2016 ]
  -*Read LICENSE to know more about permissions*-

  Logger file. Logs to console a specified input with several options.
  To know more about it, check: https://github.com/TheRacingLion/Discord-SelfBot#--logging--
*/
const moment = require('moment')
const chalk = require('chalk')
const status = {
  online: `${chalk.green('"online"')}`,
  idle: `${chalk.yellow('"idle"')}`,
  dnd: `${chalk.red('"dnd"')} (Do Not Disturb)`,
  invisible: '"invisible"'
}

function configErr (text) { console.error(`\n[${chalk.cyan(moment().format('H:mm:ss'))}]${chalk.bgRed.bold(' Config Error ')} ${text}\n`); process.exit() }

function logger (bg, title, text, timed = true) { console.log(`${timed ? `[${chalk.cyan(moment().format('H:mm:ss'))}]` : ''}${chalk[bg].bold(` ${title} `)} ${text}`) }

module.exports = {
  log (text, title = 'Log', bg = 'bgCyan', timed = false) { logger(bg, title, text, timed) },
  warn (text) { logger('bgYellow', 'Warning', text) },
  err (err, title = 'Bot') { logger('bgRed', `${title} Error`, `\n${(err && err.stack) || err}`) },
  db (text) { logger('bgWhite', 'Database', text) },
  fs (text, title) { logger('bgGreen', title, text) },
  cmd (msg, self) {
    if (typeof msg === 'object') {
      const cleanMsg = msg.cleanContent.replace(/\n/g, ' ')
      if (msg.author.id !== self.user.id) return
      logger('bgYellow', 'Msg', `|> ${chalk.magenta.bold(msg.channel.guild ? msg.channel.guild.name : 'in PMs')}: ${cleanMsg}`)
    }
  },
  mention (msg) {
    if (typeof msg === 'object') {
      const cleanMsg = msg.cleanContent.replace(/\n/g, ' ')
      logger('magenta', 'Mention', `|> ${chalk.bgYellow.bold(msg.channel.guild.name)}|> #${chalk.bgYellow.bold(msg.channel.name)}|> ${msg.author.username} (${msg.author.id}):\n\n${cleanMsg}\n`)
    }
  },
  ready (self, config) {
    if (self.user.id !== config.ownerID) { configErr('Invalid ownerID. This ID does not match the ID of your token. It must be YOUR discord ID.') } else {
      console.log(chalk.cyan([
        `\n/==================== Started at ${chalk.yellow(moment(self.startTime).format('H:mm:ss'))} ====================/`,
        `| Logged in as ${chalk.yellow(self.user.username)}.`,
        `| ${chalk.white(`Your discord status is ${status[config.defaultStatus.toLowerCase()]}. Current stats:`)}\n`,
        `    - ${chalk.yellow(self.guilds.size)} servers (${chalk.yellow(Object.keys(self.channelGuildMap).length)} channels) (${chalk.yellow(self.users.size)} users)`,
        `    - ${chalk.yellow(self.relationships.size)} friends (${chalk.yellow(self.relationships.filter(r => r.status !== 'offline').length)} online)\n`,
        `| ${chalk.white('Logging was successful. Waiting for orders...')}`,
        `| Use ${chalk.yellow('Control + C')} to exit. Or ${chalk.yellow('Cmd + C')} for Mac.`,
        `/=============================================================/`
      ].join('\n')))
    }
  },
  validateConfig (config) {
    logger('bgCyan', 'Config', 'Checking Config File...')
    if (config.token === '' || typeof config.token !== 'string') {
      configErr('Invalid Token.')
    } else if (!(/^\d{17,18}/.test(config.ownerID)) || typeof config.ownerID !== 'string') {
      configErr('Invalid ownerID. Must be a string of your discord ID.')
    } else if (config.prefix === '' || typeof config.prefix !== 'string') {
      configErr('Invalid Prefix.')
    } else if (typeof config.rotatePlayingGame !== 'boolean') {
      configErr('Invalid rotatePlayingGame. (Must be either true or false)')
    } else if (config.rotatePlayingGame && (isNaN(config.rotatePlayingGameTime) || config.rotatePlayingGameTime <= 5000)) {
      configErr('Invalid rotatePlayingGameTime. Must be a integer number bigger than 5000 (5 seconds).')
    } else if (typeof config.rotatePlayingGameInStreamingStatus !== 'boolean') {
      configErr('Invalid rotatePlayingGameInStreamingStatus. (Must be either true or false)')
    } else if (typeof config.rotateAvatarImage !== 'boolean') {
      configErr('Invalid rotateAvatarImage. (Must be either true or false)')
    } else if (config.rotateAvatarImage && (isNaN(config.rotateAvatarImageTime) || config.rotateAvatarImageTime < 600000)) {
      configErr('Invalid rotateAvatarImageTime. Must be a integer number bigger than 300000 (5 minutes).')
    } else if (typeof config.defaultStatus !== 'string' || Object.keys(status).indexOf(config.defaultStatus.toLowerCase()) < 0) {
      configErr(`Invalid defaultStatus. Must be either:\n${Object.values(status).join(', ')}`)
    } else if (typeof config.mentionNotificator !== 'object') {
      configErr('Invalid mentionNotificator. Must be an object with two options:\n\n"mentionNotificator": {\n  "inConsole": true,\n  "inNotificationChannel": true\n}')
    } else if (typeof config.mentionNotificator.inConsole !== 'boolean') {
      configErr('Invalid mentionNotificator -> "inConsole". (Must be either true or false)')
    } else if (typeof config.mentionNotificator.inNotificationChannel !== 'boolean') {
      configErr('Invalid mentionNotificator -> "inNotificationChannel". (Must be either true or false)')
    } else if (typeof config.eventNotificator !== 'object') {
      configErr('Invalid eventNotificator. Must be an object with two options:\n\n"eventNotificator": {\n  "inConsole": true,\n  "inNotificationChannel": true\n}')
    } else if (typeof config.eventNotificator.inConsole !== 'boolean') {
      configErr('Invalid eventNotificator -> "inConsole". (Must be either true or false)')
    } else if (typeof config.eventNotificator.inNotificationChannel !== 'boolean') {
      configErr('Invalid eventNotificator -> "inNotificationChannel". (Must be either true or false)')
    } else if ((config.mentionNotificator.inNotificationChannel || config.eventNotificator.inNotificationChannel) && !(/^\d{17,18}/.test(config.notificationChannelID))) {
      configErr('Invalid notificationChannelID. Must be a channel ID from a server you are in.')
    } else if (!/#?([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/i.test(config.defaultEmbedColor)) {
      configErr('Invalid defaultEmbedColor. Must be a valid hex color code.')
    } else if (typeof config.deleteCommandMessages !== 'boolean') {
      configErr('Invalid deleteCommandMessages. (Must be either true or false)')
    } else {
      logger('bgCyan', 'Config', 'Config is valid. Starting Bot...')
    }
  }
}
