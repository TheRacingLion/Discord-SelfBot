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
module.exports = (self, log, helper) => {
  self.registerCommand('me', (msg, args) => {
    msg.delete().then(() => msg.channel.createMessage({embed: helper.createMeEmbed(msg, args)}))
  })
}
