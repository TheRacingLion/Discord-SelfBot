/*
  Streaming. Set your status as streaming cause why not.
*/
module.exports = (self, log, helper, config) => {
  self.registerCommand('streaming', (msg, args) => {
    self.editStatus(config.defaultStatus.toLowerCase(), {name: args ? args.join('') : 'nothing', type: 1, url: 'https://www.twitch.tv/twitch'})
    helper.delMsg(msg, '👌')
  })
}
