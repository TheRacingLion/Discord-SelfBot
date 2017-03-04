/*
  Me. Quote you or someone else with cool discord embeds. For user you can input a mention, and ID or a name.
  Quote without author: "me text"
  To quote you: "me user text"
  To quote someone else: "me user @someone text"
  In any part of the command you can use "color=someColor" to change the color of the embed, some color options are:
  "color=random" will randomly pick a color
  "color=role" will get the color of the highest role the user has
  "color=#2a3g4h" will allow you to set a custom color
  "color=BASIC_COLOR_NAME" BASIC_COLOR_NAME is color names like: yellow, blue, gold, purple
  If no color is chosen for the embed, the embed will have the default color set in the config file.
*/
module.exports = (self) => {
  self.registerCommand('me', function (msg, args) {
    // Get user, if any.
    let user = {name: null, avatar: null, id: false}
    if (/user/.test(args[0])) {
      let isUser = this.findMember(msg, args[1])
      if (isUser) {
        user = {name: `${isUser.username}#${isUser.discriminator}`, avatar: isUser.avatarURL, id: isUser.id}
        args.splice(0, 2)
      } else {
        user = {name: `${msg.author.username}#${msg.author.discriminator}`, avatar: msg.author.avatarURL, id: msg.author.id}
        args.splice(0, 1)
      }
    }
    // Get color
    let indexOfColor = args.indexOf(args.find(s => /color=.+/ig.test(s)))
    let color = ~indexOfColor ? args[indexOfColor] : this.defaultColor
    if (color !== this.defaultColor) {
      args.splice(indexOfColor, 1)
      color = this.getColor(color.replace(/color=/i, ''), msg, user)
    }
    // Send msg
    this.embed(msg, {
      author: { name: user.name, icon_url: user.avatar },
      description: args.join(' '),
      color: color
    })
  }, {
    deleteAfter: false
  })
}
