/*
  Streaming. Set your status as streaming cause why not.
*/
module.exports = (self, log, helper) => {
  self.registerCommand('streaming', (msg, args) => {
    self.editStatus('idle', {name: args ? args.join('') : 'nothing', type: 1, url: 'https://www.twitch.tv/twitch'})
    .then(() => helper.delMsg(msg, '👌'))
  })
}
