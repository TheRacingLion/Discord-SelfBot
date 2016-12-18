/*
  Help. Shows all command names in console.
*/
module.exports = (self, log, helper) => {
  self.registerCommand('help', (msg, args) => {
    log.log(`Bot commands:\n${Object.keys(self.commands).join('\n')}`, 'Help')
    return helper.delMsg(msg, 'Check console.')
  })
  self.registerCommandAlias('h', 'help')
}
