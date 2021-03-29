require("dotenv").config();
TOKEN = process.env.TOKEN;
const fs = require("fs");
const { Client, MessageAttachment, DiscordAPIError } = require("discord.js");
const Discord = require("discord.js");
const sort = require("./sort.js");
const https = require("https");
const { performance } = require("perf_hooks");
const client = new Client();
const files = fs.readdirSync("./pepes/");
const screenshot = require("screenshot-desktop");
const prefix = require("discord-prefix");
const defaultprefix = "~";
let setEmbeds = require("./embeds");

const { commandList: cmdList } = require("./commands.js");

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  let guildPrefix = prefix.getPrefix(message.guild.id);
  if (!guildPrefix) {
    prefix.setPrefix("~", message.guild.id);
    guildPrefix = defaultprefix;
  }

  let msgarr = message.content.split(" ");
  let command = msgarr[0];
  let args = msgarr.slice(1);

  if (command === `${guildPrefix}` + "rngPepe") {
    let chosenFile = files[Math.floor(Math.random() * files.length)];
    // Create the attachment using MessageAttachment
    const attachment = new MessageAttachment("./pepes/" + chosenFile);
    // Send the attachment in the message channel
    message.channel.send(`${message.author},`, attachment);
  } else if (command === `${guildPrefix}` + "sort") {
    let nums = [];
    let algo = args.shift();
    let answer = "```diff" + "\nUSING " + algo + "()" + "\nOriginal Sets\n";

    args.forEach((el) => nums.push(el.split(",")));

    for (let i in nums) {
      answer += "- Set " + (i + 1) + ": " + nums[i] + "\n";
    }

    message.channel.send(`${message.author}`);
    answer += "\nNew Sets\n";
    let time = 0;
    for (let i in nums) {
      const t0 = performance.now();
      sort[algo](nums[i]);

      const t1 = performance.now();
      time += t1 - t0;
      answer += "+Set " + (Number(i) + 1) + ": " + nums[i].toString() + "\n";
    }

    time = time.toFixed(4);
    answer +=
      "\nSort time: " +
      time +
      " ms\n" +
      "Time per set: " +
      (time / nums.length).toFixed(4) +
      " ms";
    answer += "```";

    message.channel.send(answer);
  } else if (command == `${guildPrefix}` + "asdasd" /*"!spyonadmin"*/) {
    screenshot({ filename: "./screenshots/shot.png" }).then(() => {
      const attachment = new MessageAttachment("./screenshots/shot.png");
      message.channel.send(`${message.author},`, attachment);
    });
  } else if (command == `${guildPrefix}` + "telljoke") {
    let url = "https://official-joke-api.appspot.com/random_joke";
    https.get(url, function (res) {
      var body = "";
      let joke = "";
      res.on("data", function (chunk) {
        body += chunk;
      });
      res.on("end", function () {
        joke = JSON.parse(body);
        console.log("Got a response: ", joke);
        console.log(joke.setup);
        message.channel.send(joke["setup"] + "\n" + joke["punchline"] + "·");
      });
    });
  } else if (command == `${guildPrefix}` + "hello") {
    if (message.member.voice.channel) {
      const join = await message.member.voice.channel.join();
    } else {
      message.channel.send(
        `${message.author},`,
        "You are not in a voice channel"
      );
    }
  } else if (command == `${guildPrefix}` + "setPref") {
    prefix.setPrefix(args[0], message.guild.id);
    console.log(args[0]);
    message.channel.send(
      "ok master..." + "new prefix = " + `${prefix.getPrefix(message.guild.id)}`
    );
  } else if (command == `${guildPrefix}` + "getPref") {
    message.channel.send(
      message.guild.name + " prefix: " + prefix.getPrefix(message.guild.id)
    );
    console.log(guildPrefix);
  }
});
client.on("message", async (message) => {
  if (message.author.bot) return;
  console.log(message.content);
  let cmdpref = await prefix.getPrefix(message.guild.id);
  if (message.content == "ts help" || message.content == "ts -h") {
    console.log(cmdpref);
    const embed = await setEmbeds.help(client, cmdpref);

    message.channel.send(embed);

    console.log("done");
  }
});
// Log our bot in using the token from https://discord.com/developers/applications
client.login(TOKEN);

//util
function wait(ms, value) {
  return new Promise((resolve) => setTimeout(resolve, ms, value));
}
