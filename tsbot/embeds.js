const Discord = require("discord.js");
const logogif = new Discord.MessageAttachment("./tslogo.gif", "tslogo.gif");
const { commandList: cmdList } = require("./commands.js");
function help(client, cmdpref) {
  let embed = new Discord.MessageEmbed(client)
    .setColor("#0099ff")
    .setTitle("TS commands")
    .attachFiles(logogif)
    .setURL("https://discord.js.org/")
    .setAuthor("TS_BOT", client.user.avatarURL())
    .setImage("attachment://tslogo.gif")
    .setTimestamp()
    .setFooter("Some footer text here");
  
  cmdList.forEach((el) => {
    embed.addField(cmdpref+el.cmd, el.whatdo);
  });
  return embed;
}
exports.help = help;
