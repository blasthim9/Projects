const cleverbot = require("cleverbot-free");
const fs = require("fs");
const util = require("util");
const say = require("say");
const { VoiceChannel } = require("discord.js");
const { fileURLToPath } = require("url");

class Clever {
  context = [];
  selftalk = [];
  bot1 = true;

  cleverchat(args, message) {
    if (args[0] === "/clear") {
      this.context = new Array();
      message.channel.send("context cleared! start a new chat");
    } else if (args[0] === "/showcontext") {
      if (this.context.length === 0) {
        message.channel.send("No context");
      } else message.channel.send(this.context);
    } else if (args[0] === "/speaktoself") {
      this.escape = args[1] || 10;
      this.initial = args.slice(2).join(" ");
      this.self(message, this.initial);
    } else if (args[0] === "/voice") {
      let userMsg = args.slice(1).join(" ");
      let voiceChannel = message.member.voice.channel;
      let response = cleverbot(userMsg, this.context);
      this.context.push(userMsg);
      response
        .then((result) => {
          say.export(result, "Cellos", 1, "speech.mp3");
          this.context.push(result);
        })
        .then(() =>
          voiceChannel.join().then((connection) => {

            while(!fs.existsSync('./speech.mp3')){
                console.log('Waiting...')
                console.clear()
            }
            const dispatcher = connection.play("./speech.mp3");
            console.log(this.context);
            dispatcher.on("finish", (finish) => {
              //voiceChannel.leave();
              fs.unlink('speech.mp3', (err) => {
                if (err) {
                  console.error(err)
                  return
                }
              })

            });
          })
        );
    } else {
      let userMsg = args.join(" ");
      console.log(this.context, "\n", "before send");
      cleverbot(userMsg, this.context).then((response) => {
        this.context.push(userMsg);
        this.context.push(response);
        console.log(this.context, "\n");
        message.channel.send(response);
      });
    }
  }
  self(message, init = "hi") {
    cleverbot(init, this.selftalk).then((response) => {
      let current = this.bot1 ? "Bot 1" : "Bot 2";
      message.channel.send(">>> " + current + ": " + init);
      this.bot1 = !this.bot1;
      this.selftalk.push(init);
      console.log(this.selftalk);
      if (this.selftalk.length == this.escape) {
        this.selftalk = new Array();
        return;
      }
      this.self(message, response);
    });
  }
}

module.exports = Clever;
