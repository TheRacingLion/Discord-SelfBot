/*
  Created by TheRacingLion (https://github.com/TheRacingLion) [ 03 / 03 / 2017 ]
  -*Read LICENSE to know more about permissions*-

  Config Validator. Checks if the config is valid before letting the bot start.
*/
const moment = require('moment')
const chalk = require('chalk')
const status = {
  online: `${chalk.green('"online"')}`,
  idle: `${chalk.yellow('"idle"')}`,
  dnd: `${chalk.red('"dnd"')} (Do Not Disturb)`,
  invisible: '"invisible"'
}

function Err (key, type = '') {
  if (type === 'bol') type = '(Must be either true or false)'
  console.error(`\n[${chalk.cyan(moment().format('H:mm:ss'))}]${chalk.bgRed.bold(' Config Error ')} Invalid ${key}. ${type}.\n`)
  process.exit()
}

module.exports.check = function (config, log) {
  log.log('Checking Config File...', 'Config', 'bgCyan', true)
  if (config.token === '' || typeof config.token !== 'string') {
    Err('Token')
  } else if (!(/^\d{17,18}/.test(config.ownerID)) || typeof config.ownerID !== 'string') {
    Err('ownerID', 'Must be a string of your discord ID')
  } else if (config.prefix === '' || typeof config.prefix !== 'string') {
    Err('Prefix')
  } else if (typeof config.rotatePlayingGame !== 'boolean') {
    Err('rotatePlayingGame', 'bol')
  } else if (config.rotatePlayingGame && (isNaN(config.rotatePlayingGameTime) || config.rotatePlayingGameTime <= 5000)) {
    Err('rotatePlayingGameTime', 'Must be a integer number bigger than 5000 (5 seconds).')
  } else if (typeof config.rotatePlayingGameInStreamingStatus !== 'boolean') {
    Err('rotatePlayingGameInStreamingStatus', 'bol')
  } else if (typeof config.rotateAvatarImage !== 'boolean') {
    Err('rotateAvatarImage', 'bol')
  } else if (config.rotateAvatarImage && (isNaN(config.rotateAvatarImageTime) || config.rotateAvatarImageTime < 600000)) {
    Err('rotateAvatarImageTime', 'Must be a integer number bigger than 300000 (5 minutes).')
  } else if (typeof config.defaultStatus !== 'string' || Object.keys(status).indexOf(config.defaultStatus.toLowerCase()) < 0) {
    Err(`defaultStatus. Must be either:\n${Object.values(status).join(', ')}`)
  } else if (typeof config.mentionNotificator !== 'object') {
    Err('mentionNotificator', 'Must be an object with two options:\n\n"mentionNotificator": {\n  "inConsole": true,\n  "inNotificationChannel": true\n}')
  } else if (typeof config.mentionNotificator.inConsole !== 'boolean') {
    Err('mentionNotificator -> "inConsole"', 'bol')
  } else if (typeof config.mentionNotificator.inNotificationChannel !== 'boolean') {
    Err('mentionNotificator -> "inNotificationChannel"', 'bol')
  } else if (typeof config.eventNotificator !== 'object') {
    Err('eventNotificator', 'Must be an object with two options:\n\n"eventNotificator": {\n  "inConsole": true,\n  "inNotificationChannel": true\n}')
  } else if (typeof config.eventNotificator.inConsole !== 'boolean') {
    Err('eventNotificator -> "inConsole"', 'bol')
  } else if (typeof config.eventNotificator.inNotificationChannel !== 'boolean') {
    Err('eventNotificator -> "inNotificationChannel"', 'bol')
  } else if ((config.mentionNotificator.inNotificationChannel || config.eventNotificator.inNotificationChannel) && !(/^\d{17,18}/.test(config.notificationChannelID))) {
    Err('notificationChannelID', 'Must be a channel ID from a server you are in.')
  } else if (!/#?([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/i.test(config.defaultEmbedColor)) {
    Err('defaultEmbedColor', 'Must be a valid hex color code.')
  } else if (typeof config.deleteCommandMessages !== 'boolean') {
    Err('deleteCommandMessages', 'bol')
  } else if (config.deleteCommandMessages && isNaN(config.deleteCommandMessagesTime)) {
    Err('deleteCommandMessagesTime', 'Must be a integer number.')
  } else {
    log.log('Config is valid. Starting Bot...', 'Config', 'bgCyan', true)
  }
}
