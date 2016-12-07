/*
  Created by TheRacingLion (https://github.com/TheRacingLion) [ 6 / 12 / 2016 ]
  -*Read LICENSE to know more about permissions*-

  Main Selfbot file. Events and setting up the discord client.
*/
const Eris = require('eris')
const fs = require('fs')
const config = require('./config/config.json')
const games = require('./config/games.json')
const log = require('./utils/logger.js')

// Check if config is valid
log.validateConfig(config)

// Setup discord client
const self = new Eris.CommandClient(config.token, {autoreconnect: true}, {
  defaultCommandOptions: {caseInsensitive: true, requirements: {userIDs: [config.ownerID]}},
  defaultHelpCommand: false,
  prefix: config.prefix,
  ignoreSelf: false
})

self.on('ready', () => {
  log.ready(self, config)
  if (config.rotatePlayingGame && games.length !== 0) {
    log.log('Changing playing game every ' + (config.rotatePlayingGameTime / 1000) / 60 + ' minutes.', 'Config')
    setInterval(() => {
      self.editStatus(null, {name: games[~~(Math.random() * games.length)]})
    }, config.rotatePlayingGameTime) // Edits playing game every X milliseconds (You can edit this number in the config file)
  }
})

self.on('warn', (msg) => { log.warn(msg) })

self.on('error', (err) => { log.err(err, 'Bot') })

self.on('disconnect', () => { log.log('Bot Disconnected from Discord', 'Disconnect') })

let cmds = {} // eslint-disable-line
fs.readdir(__dirname + '/commands/', (err, files) => {
  log.log(`Loading ${files.length} command files...`, 'Cmds', 'bgGreen', true)
  if (err) { log.err(err, 'Command Directory Reading') } else if (!files) { log.err('No command files.', 'Command Directory Reading') } else {
    for (let command of files) {
      if (command.endsWith('.js')) {
        command = command.replace(/\.js$/, '')
        cmds = require(`./commands/${command}.js`)(self, log)
      }
    }
    log.log('Finished.', 'Cmds', 'bgGreen', true)
  }
})

self.on('messageCreate', (msg) => { if (msg.author.id === self.user.id) { if (msg.command) { log.cmd(msg, self) } } })

require('./utils/mentionStalker.js')(self, log, config)

self.connect().catch(err => { log.err(err, 'Login') })

process.on('SIGINT', () => { self.disconnect({reconnect: false}); setTimeout(() => { process.exit(0) }, 1000) })

process.on('unhandledRejection', (err) => { log.err(err, 'Promise was rejected but there was no error handler') })
