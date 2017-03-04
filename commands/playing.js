/*
  Play. Edit your playing game name. Leave blank to clear game.
  Dont forget that when you edit your game with a selfbot you wont be able to see it, but other people will.

  If you have auto game rotation set to "true", this command is pretty useless, cause if you use it, when the auto rotate comes, it will just override it.
  You can fix this by turning auto game rotation to false in config.json and then just setting a game yourself.
*/
module.exports = (self) => {
  self.registerCommand('playing', function (msg, args) {
    this.self.editStatus(this.config.defaultStatus.toLowerCase(), args ? {name: args.join(' ')} : null)
    this.send(msg, '👌')
  })
}
