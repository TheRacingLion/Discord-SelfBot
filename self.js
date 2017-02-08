/*
  Created by TheRacingLion (https://github.com/TheRacingLion) [ 18 / 12 / 2016 ]
  -*Read LICENSE to know more about permissions*-

  Main Selfbot file. Events and setting up the discord client.
*/
const Eris = require('eris')
const fs = require('fs')
const path = require('path')
const config = require('./config/config.json')
const games = require('./config/games.json')
const helper = require('./utils/helpers.js')
const log = require('./utils/logger.js')

// Check if config is valid
log.validateConfig(config)

// Setup discord client with selfbot options
const self = new Eris.CommandClient(config.token, { autoreconnect: true }, {
  defaultCommandOptions: {caseInsensitive: true, requirements: {userIDs: [config.ownerID]}},
  defaultHelpCommand: false,
  prefix: config.prefix,
  ignoreSelf: false
})

// Event handling
self.on('warn', (msg) => log.warn(msg))
self.on('error', (err) => log.err(err, 'Bot'))
self.on('disconnect', () => log.log('Disconnected from Discord', 'Disconnect'))

// Load avatar images (if any)
let avatars = []
const dir = path.join(__dirname, 'config/avatars/')
fs.readdir(dir, (err, files) => {
  log.fs(`Loading ${files.length} avatar images...`, 'Avatars')
  if (err) return log.err(err, 'Avatars Directory Reading')
  if (!files) { return log.err('No avatar images found.', 'Avatars Directory Reading') } else {
    for (let avatar of files) {
      let ext = path.extname(avatar).match(/\.png|\.jpeg|\.gif|\.jpg/)
      if (!ext) continue
      try {
        let data = fs.readFileSync(path.join(dir, avatar))
        log.fs(`Loaded: ${avatar}`, 'Avatars')
        avatars.push(`data:image/${ext[0].replace('.', '')};base64,` + new Buffer(data).toString('base64'))
      } catch (err) { log.err(err, 'Avatars Directory Reading') }
    }
    if (avatars.length === 0) return log.fs('No avatar images found.', 'Avatars')
    log.fs('Finished.', 'Avatars')
  }
})

// Load command files
let cmds = {} // eslint-disable-line
fs.readdir(path.join(__dirname, 'commands/'), (err, files) => {
  log.fs(`Loading ${files.length} command files...`, 'Cmds')
  if (err) return log.err(err, 'Command Directory Reading')
  if (!files) { log.err('No command files.', 'Command Directory Reading') } else {
    for (let command of files) {
      if (path.extname(command) !== '.js') continue
      cmds = require(`./commands/${command}`)(self, log, helper, config)
    }
    log.fs('Finished.', 'Cmds')
  }
})

// On ready
self.on('ready', () => {
  log.ready(self, config)
  if (config.rotatePlayingGame && games.length > 0) {
    log.log('Changing playing game every ' + (config.rotatePlayingGameTime / 1000) / 60 + ' minutes.', 'Config')
    setInterval(() => {
      self.editStatus(config.defaultStatus.toLowerCase(), {name: games[~~(Math.random() * games.length)]})
    }, config.rotatePlayingGameTime) // Edits playing game every X milliseconds (You can edit this number in the config file)
  }
  if (config.rotateStreamingGame && streams.length > 0) {
    log.log('Changing streaming status every ' + (config.rotateStreamingStatusTime / 1000) / 60 + ' minutes.', 'Config')
    setInterval(() => {
      self.editStatus(config.defaultStatus.toLowerCase(), {name: games[~~(Math.random() * games.length)], type: 1, url: 'https://www.twitch.tv/twitch'})
    }, config.rotateStreamingStatusTime) // Edits streaming status every X milliseconds (You can edit this number in the config file)
  }
  if (config.rotateAvatarImage && avatars.length > 0) {
    log.log('Changing avatar every ' + (config.rotateAvatarImageTime / 1000) / 60 + ' minutes.', 'Config')
    setInterval(() => {
      log.log('Changing avatar')
      self.editSelf({avatar: avatars[Math.floor(Math.random() * avatars.length)]}).catch(err => log.err(err, 'Avatar Rotator'))
    }, config.rotateAvatarImageTime) // Edits avatar every X milliseconds (You can edit this number in the config file)
  }
})

self.on('messageCreate', (msg) => { if (msg.author.id === self.user.id) { if (msg.command) { log.cmd(msg, self) } } })

require('./utils/mentionStalker.js')(self, log, config)

self.connect().catch(err => log.err(err, 'Login'))

process.on('SIGINT', () => { self.disconnect({reconnect: false}); setTimeout(() => process.exit(0), 1000) })

process.on('unhandledRejection', (err) => log.err(err, 'Promise was rejected but there was no error handler'))
