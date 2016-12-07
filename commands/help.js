/*
  Help. Shows all command names in console.
*/
module.exports = (self, log) => {
  self.registerCommand('help', (msg, args) => {
    log.log(`All bot commands:\n${Object.keys(self.commands).join('\n')}`, 'Help')
    msg.edit('Check console.')
  })
  self.registerCommandAlias('h', 'help')
}
