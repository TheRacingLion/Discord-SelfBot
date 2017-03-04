/*
  Created by TheRacingLion (https://github.com/TheRacingLion) [ 18 / 12 / 2016 ]
  -*Read LICENSE to know more about permissions*-

  Main Selfbot file. Lots of really important stuff that make this selfbot work.
*/
const Eris = require('eris')
const path = require('path')
const fs = require('fs')

const configValidator = require('./src/utils/ConfigValidator.js')
const constants = require('./src/utils/Constants.js')
const log = require('./src/plugins/Logger.js')

const config = require('./config/config.json')
const games = require('./config/games.json')

const Command = require('./src/Command.js')

// Check if config is valid
configValidator.check(config, log)

// Setup discord client
const self = new Eris(config.token)
let isReady = false

// Pass config and constants to self
self.constants = constants
self.config = config

const commands = {
  main: {},
  aliases: {}
}

// Register Command Function
self.registerCommand = function (name, generator, options) {
  if (!name) {
    throw new Error('You must specify a name for the command')
  }
  if (name.includes(' ')) {
    throw new Error('Command names cannot contain spaces')
  }
  if (commands.main[name]) {
    throw new Error('You have already registered a command for ' + name)
  }
  options = options || {}
  name = name.toLowerCase()
  commands.main[name] = new Command(self, name, generator, options)
  if (options.aliases && options.aliases.length > 0) {
    options.aliases.forEach((alias) => {
      commands.aliases[alias] = name
    })
  }
  return commands.main[name]
}

self.on('messageCreate', (msg) => {
  if (!isReady) return
  // Only reply to owner
  if (msg.author.id !== self.user.id) return
  // Get prefix and check for it
  const prefix = self.config.prefix.replace(/@mention/g, self.user.mention)
  if (msg.content.replace(/<@!/g, '<@').startsWith(prefix)) {
    // Only if isnt empty command
    if (msg.content.length === prefix.length) return

    // Get trigger and args
    const args = msg.content.replace(/<@!/g, '<@').substring(prefix.length).split(' ')
    let trigger = args.shift().toLowerCase()
    trigger = commands.aliases[trigger] || trigger

    // Get command and run it
    const command = commands.main[trigger]
    if (command !== undefined) {
      log.cmd(msg, self)
      setTimeout(() => self.deleteMessage(msg.channel.id, msg.id), 750)
      command.process(msg, args)
    }
    return
  }
  return
})

// Event handling
self.on('warn', (msg) => { if (msg.includes('Authentication')) { log.warn(msg) } })
self.on('error', (err) => log.err(err, 'Bot'))
self.on('disconnect', () => log.log('Disconnected from Discord', 'Disconnect'))

// Load avatar images (if any)
let avatars = []
const dir = path.join(__dirname, 'config/avatars/')
fs.readdir(dir, (err, files) => {
  log.fs(`Loading ${files.length} files...`, 'Avatars')
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
    if (avatars.length === 0) return log.fs('No images found.', 'Avatars')
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
      cmds = require(`./commands/${command}`)(self)
    }
    log.fs('Finished.', 'Cmds')
  }
})

// On ready
self.on('ready', () => {
  isReady = true
  self.commands = commands
  log.ready(self, config)
  if (config.rotatePlayingGame && games.length > 0) {
    const stream = config.rotatePlayingGameInStreamingStatus
    log.log(`Changing playing game ${stream ? 'in streaming status ' : ''}every ` + (config.rotatePlayingGameTime / 1000) / 60 + ' minutes.', 'Config')
    setInterval(() => {
      const game = games[~~(Math.random() * games.length)]
      self.editStatus(config.defaultStatus.toLowerCase(), stream ? {name: game, type: 1, url: 'https://www.twitch.tv/twitch'} : {name: game})
    }, config.rotatePlayingGameTime) // Edits playing game every X milliseconds (You can edit this number in the config file)
  }
  if (config.rotateAvatarImage && avatars.length > 0) {
    log.log('Changing avatar every ' + (config.rotateAvatarImageTime / 1000) / 60 + ' minutes.', 'Config')
    setInterval(() => {
      log.log('Changing avatar')
      self.editSelf({avatar: avatars[Math.floor(Math.random() * avatars.length)]}).catch(err => log.err(err, 'Avatar Rotator'))
    }, config.rotateAvatarImageTime) // Edits avatar every X milliseconds (You can edit this number in the config file)
  }
})

require('./src/plugins/MentionStalker.js')(self, log, config)

self.connect().catch(err => log.err(err, 'Login'))

process.on('SIGINT', () => { self.disconnect({reconnect: false}); setTimeout(() => process.exit(0), 1000) })

process.on('unhandledRejection', (err) => log.err(err, 'Promise was rejected but there was no error handler'))
