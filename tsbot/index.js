require("dotenv").config();
TOKEN = process.env.TOKEN;
const cleverbot = require('./cleverbot.js')
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
const ytdl = require("ytdl-core");
const queue = new Map();
const chatbot = new cleverbot()
const search = require("youtube-search");
const opts = {
  maxResults: 10,
  key: process.env.KEY,
};
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
  const serverQueue = queue.get(message.guild.id);
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
  } else if (command == `${guildPrefix}` + "spyonadmin") {
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
  } else if (command === `${guildPrefix}` + "render") {
    message.channel.send("*GAWK* *GAWK* *GAWK*");

    let t0 = performance.now();
    await render();
    const attachment = new MessageAttachment("./rendered.png");

    message.channel.send(`${message.author},`, attachment);
    let t1 = performance.now();
    message.channel.send("render time:" + `${(t1 - t0).toFixed(4)}` + " ms");
  } else if (message.content.startsWith(`${guildPrefix}play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${guildPrefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${guildPrefix}stop`)) {
    stop(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${guildPrefix}leave`)) {
    message.channel.send("bye bitch");
    message.member.voice.channel.leave();
  } else if (message.content.startsWith(`${guildPrefix}chat`)){

    chatbot.cleverchat(args,message)
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

//test area
const puppeteer = require("puppeteer");
const { writeFile } = require("fs-extra");
const clever = require("./cleverbot.js");

async function render() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    height: 1080,
    width: 1920,
  });

  // If your HTML is saved to a file, you load it like this:
  await page.goto("file:///C:/Rep/Projects/p5flow/index.html");

  // if your HTML is in memory (as a string), you load it like this:
  // page.setContent(htmlString);
  await page.keyboard.press("Control");
  const imageBuffer = new Array();

  imageBuffer.push(await page.screenshot({}));

  await browser.close();

  // write file to disk as buffer
  for (let i in imageBuffer) {
    await writeFile(`rendered.png`, imageBuffer[i]);
  }

  // convert to base64 string if you want to:
  //console.log(imageBuffer.toString('base64'));
}

async function execute(message, serverQueue) {
  const args = message.content.split(" ");
  const songname = args.slice(1,args.length).join(' ')
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send("Must be in channel to play music!");
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send("no permission :(!");
  }
  let validate = await ytdl.validateURL(args[1]);
  console.log(validate);

  
  let results = await search(songname, opts)
  args[1]= results.results[0].link
  const songInfo = await ytdl.getInfo(args[1]);
  console.log(args)
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
      console.log(queueContruct)
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send("JOIN THE CHANNEL FIRST!");
  if (!serverQueue) return message.channel.send("Song list empty idiot! ");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send("Denied! You must be in the voice channel");

  if (!serverQueue) return message.channel.send("Song list empty retard!");

  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url,{
      quality: 'highestaudio',
      highWaterMark: 1 << 25
  }))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", (error) => console.error(error));

  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Current Song: **${song.title}**`);
}
