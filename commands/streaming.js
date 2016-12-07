/*
  Streaming. Set your status as streaming cause why not.
*/
module.exports = (self, log) => {
  self.registerCommand('streaming', (msg, args) => {
    msg.edit('👌').then(m => self.editStatus('idle', {name: args ? args.join('') : 'nothing', type: 1, url: 'https://www.twitch.tv/twitch'}))
  })
}
